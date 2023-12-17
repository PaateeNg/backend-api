import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { VendorInput } from './input/vendor.input';
import { comparePassword, hashed } from 'src/common/hashed/util.hash';
import { UpdateVendorDto } from './input/update.vendor.input';
import { GraphQLError } from 'graphql';
import { ChangeVendorPasswordDTO } from './input/changeVendorPassword.input';
import { ForgetVendorPasswordDTO } from './dto/forgetpassword.dto';

import { ResetVendorPasswordDTO } from './dto/resetpassword.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor } from './schema/vendor.schema';
import { Model } from 'mongoose';
import { transporter } from 'src/common/nodemailer/email.nodemailer';
import { resetPasswordOtp, sendotp } from 'src/common/otp/otp.token';
import { returnString } from 'src/common/return/return.input';

@Injectable()
export class VendorService {
    constructor(  
    @InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>,
    ){ transporter}

    async vendorRegister(vendorinput: VendorInput) {
   try {
    const vendor = await this.vendorModel.findOne({ email: vendorinput.email})

    if(vendor){
        throw new ConflictException('vendor with the same email already exists');
    }

    vendorinput.password = await hashed(vendorinput.password);

    const newVendor = await this.vendorModel.create({
        ...vendorinput
    })
    return newVendor;
   } catch (error) {
    if (error instanceof ConflictException) {
        throw error;
      }
  
      throw new InternalServerErrorException('Server error while creating your account');
   }
        
    }

    async updatevendor(id: string, updatevendor: UpdateVendorDto):Promise<returnString> {
        try {
            const vendor = await this.vendorModel.findById(id);
          
        if (!vendor) {
            throw new ConflictException('id does not exist');
        }
        
        if (vendor.suspended === true) {
            throw new ConflictException('Your account is not suspended, kindly chat with one of our moderator');
        }
        // Update vendor with the provided data
        const updatedVendor = await this.vendorModel.findByIdAndUpdate(
            id,
            updatevendor,
            {
                new: true,
                runValidators: true
            }
        );
    
        if (!updatedVendor) {
            throw new ConflictException('Failed to update vendor');
        }
    
       // return updatedVendor;
       return{
        Response: 'updated Successfully'
       }

        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
              }
          
              throw new InternalServerErrorException('Server error');
        }
    }
    


    //searh for vendor
    async findallvendors() {
        try {
            const vendors = await this.vendorModel.find({
                suspended: false,
                approved: true,
                deleted: false
            });
    
            return vendors;
        } catch (error) {
            // Handle the error, log it, or throw a custom GraphQL error if needed
            console.error('Error while fetching vendors:', error);
            throw new GraphQLError('Failed to fetch vendors');
        }
    }
    
    ///find one vendor by id
    async findVendorById(id: string): Promise<Vendor>{
       
       try {
        const vendor = await this.vendorModel.findOne({
            _id: id,
           deleted: false,
           approved: true,
           suspended: false
        })


        if (!vendor) {
            throw new HttpException('vendor not found', HttpStatus.NOT_FOUND)
        }
        return vendor

       } catch (error) {
        if (error instanceof HttpException) {
            throw error
           
        }
        console.log(error)
        throw new InternalServerErrorException('server error')
       }
    }

    //change password
   async changeVendorPassword(id: string, changeVendorpassword: ChangeVendorPasswordDTO) {
  try {
    const vendor = await this.vendorModel.findById(id)

    if (changeVendorpassword.password !== changeVendorpassword.confirmedPassword) {
        throw new GraphQLError('check you password')
    }

    if (await comparePassword(changeVendorpassword.confirmedPassword, vendor.password) === false) {
        throw new GraphQLError('your confirmed old password does not matched')
    }
    vendor.password =  await hashed(changeVendorpassword.password)

    await this.vendorModel.findByIdAndUpdate(id, changeVendorpassword, {
        new: true,
        runValidators: true
       })
       return 'password changed successfully'
  } catch (error) {
    console.log(error)
    throw new Error('server error')
  }
    }

    // forgot password logic
    async forgetVendorPassword(input: ForgetVendorPasswordDTO) {
      try {
        const vendor = await this.vendorModel.findOne({ email: input.email});

      if(!vendor){
        throw new HttpException('email does not exist', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      if (vendor.suspended===true) {
        throw new HttpException('error, it look your account is suspended, kindly chat with one of our moderator', HttpStatus.UNPROCESSABLE_ENTITY)
      }

                    await resetPasswordOtp(vendor)

      const emailMessage ={
        from: 'info@paateeng.com',
        to: input.email,
        subject: 'password Reset',
        text: `Click the following link to reset your password: https://yourwebsite.com/reset-password?token=${vendor.resetPasswordToken}`
      }

            try {
                await transporter.sendMail(emailMessage);
                return `reset token has been sent to email ${input.email}`;
            } catch (error) {
                throw new Error(error.message);
            } 
      } catch (error) {
        if (error instanceof ConflictException) {
            throw error;
          }
      
          throw new InternalServerErrorException('Server error while creating your account');
      }
    }

   async resetVendorPassword(input: ResetVendorPasswordDTO) {

       try {
        const vendor = await this.vendorModel.findOne({  email:input.email })
    
        if (!vendor) {
          throw new HttpException('check your email spelling', HttpStatus.UNPROCESSABLE_ENTITY)
      }
      if (vendor.resetPasswordToken !== input.token || vendor.resetTokenExpiration < new Date()) {
          throw new Error('inavlid or expired reset token')
      }
      
      if (input.newPassword !== input.confirmedNewPassword) {
          throw new HttpException('password does not matched', HttpStatus.UNPROCESSABLE_ENTITY)
      }
      
      vendor.password = await hashed(input.newPassword);
      vendor.resetPasswordToken = null;
      vendor.resetTokenExpiration = null;
      
      await vendor.save()
      return {
          info: 'password change successfull'
      }
  
       } catch (error) {
        console.log(error);
        throw new Error(error.message)
       }
    }
}
