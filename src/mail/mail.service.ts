
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { confirmedUserEmailDTO } from 'src/user/dto/confirmedusermail.dto';
import { confirmedVendorEmailDTO } from 'src/vendor/dto/confirmedVendorEmail.dto';
import { confirmedPlannerEmailDTO } from 'src/planner/dto/confirmedPlanner.dto';
import { verifyEmailDto } from './dto/verifty.email.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { Planner } from 'src/planner/schema/planner.schema';
import { transporter } from 'src/common/nodemailer/email.nodemailer';
import { sendotp } from 'src/common/otp/otp.token';
import { returnString } from 'src/common/return/return.input';


@Injectable()
export class MailService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
        @InjectModel(Planner.name) private plannerModel: Model<Planner>,
        ){transporter}

    //send user email confirmation
    async sendUserConfirmation(user: User): Promise<returnString>{
      await  sendotp(user)

     const savedUser =   await user.save();

        const sendmail={
            from: 'info@paateeng.com',
            to: savedUser.email,
            subject: 'confirmed your email',
            text: `Click the following link to confirm your registration: https://yourwebsite.com/reset-password?token=${savedUser.emailConfirmedToken}`
        }
        try {
            await transporter.sendMail(sendmail);
            console.log(`token has been sent to your email ${savedUser.email}, use it to confirm your registration`)
            //return savedUser
           return {Response: `verification code sent to ${savedUser.email}, kindly confirm your email`}
          } catch (error) {
            throw new Error(error.message);
          }  
       
    }  


    //send email token for Vendor
    async sendVendorConfirmation(vendor: Vendor): Promise<returnString>{
       await sendotp(vendor)

        const savedVendor = await vendor.save()

        const sendmail={
            from: 'info@paateeng.com',
            to: savedVendor.email,
            subject: 'confirmed your email',
            text: `Click the following link to confirm your registration: https://yourwebsite.com/reset-password?token=${savedVendor.emailConfirmedToken}`
        }
        try {
            await transporter.sendMail(sendmail);
            console.log(`token has been sent to your email ${savedVendor.email}, use it to confirm your registration`)
           // return savedVendor;
            return { Response: `verification code sent to ${savedVendor.email}, kindly confirm your email`}
          } catch (error) {
            throw new Error(error.message);
          }  
       
    }


     //send email token for Planner
     async sendPlannerConfirmation(planner: Planner): Promise<returnString>{
       await sendotp(planner)
        const savedPlanner = await planner.save()

        const sendmail={
            from: 'info@paateeng.com',
            to: savedPlanner.email,
            subject: 'confirmed your email',
            text: `Click the following link to confirm your registration: https://yourwebsite.com/reset-password?token=${savedPlanner.emailConfirmedToken}`
        }
        try {
             await transporter.sendMail(sendmail);
             console.log(`token has been sent to your email ${savedPlanner.email}, use it to confirm your registration`)
             //return savedPlanner;
            return { Response: `verification code sent to ${savedPlanner.email}, kindly confirm your email`}
          } catch (error) {
            throw new Error(error.message);
          }  
       
    }

    //confirmed user email 
   async confirmedUserEmail(input: confirmedUserEmailDTO): Promise<returnString> {
        try {
            const user  = await this.userModel.findOne({
                email: input.email
        })
        if (!user) {
            throw new HttpException('please check your email address', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        if (user.emailConfirmedToken !== input.confirmedToken || user.emailTokenExpiration< new Date()) {
            throw new HttpException('wrong credential or token has expired', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        user.emailConfirmed = true;
        user.emailConfirmedToken = null;
        user.emailTokenExpiration = null;

        const saveduser = await user.save();
       

        return {
             Response: `your email ${saveduser.email} is now verified`
        }

        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException('server error')
        }
    }

    //confirmed vendor email 
   async confirmedVendorEmail(input: confirmedVendorEmailDTO):Promise<returnString> {
       try {
        const vendor  = await this.vendorModel.findOne({
            
            email: input.email
        
    })
    if (!vendor) {
        throw new HttpException('please check your email address', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if (vendor.emailConfirmedToken !== input.confirmedToken || vendor.emailTokenExpiration< new Date()) {
        throw new HttpException('wrong credential or token has expired', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    vendor.emailConfirmed = true;
    vendor.emailConfirmedToken = null;
    vendor.emailTokenExpiration = null;

   const savedvendor= await vendor.save()

    return {
        Response: `your email address ${savedvendor.email} is now verified`
    }
       } catch (error) {
        if (error instanceof HttpException) {
           throw error 
        }
        throw new InternalServerErrorException('server error')
       }
     }

     async confirmedPlannerEmail(input: confirmedPlannerEmailDTO):Promise<returnString> {
      try {
        const planner  = await this.plannerModel.findOne({ email: input.email})

    if (!planner) {
        throw new HttpException('please check your email address', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if (planner.emailConfirmedToken !== input.confirmedToken || planner.emailTokenExpiration< new Date()) {
        throw new HttpException('wrong credential or token has expired', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    planner.emailConfirmed = true;
    planner.emailConfirmedToken = null;
    planner.emailTokenExpiration = null;

  const savedPlanner =  await planner.save()

    return {
        Response: `your email address ${savedPlanner.email} has been verified`
    }
      } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        throw new InternalServerErrorException('server error')
      }
     }

     async verifyemail(input: verifyEmailDto){

        const user  = await this.userModel.findOne({ email: input.email })

        const vendor  = await this.vendorModel.findOne({   email: input.email })

        const planner  = await this.plannerModel.findOne({email: input.email })

        if (user) {
            return await this.confirmedUserEmail(input)
        }
        if (vendor) {
            return await this.confirmedVendorEmail(input)
        }

        if (planner) {
            return await this.confirmedPlannerEmail(input)
        }

     }
}