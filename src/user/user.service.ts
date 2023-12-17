import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './input/createuser.input.dto';
import { GraphQLError } from 'graphql';
import { comparePassword, hashed } from 'src/common/hashed/util.hash';
import { UpdateUserDto } from './input/updateuser.input';
import { ChangePasswordDTO } from './input/changePassword.input';
import { ForgetUserPasswordDTO } from './dto/forgetPassword.input';
import { ResetPasswordDTO } from './dto/resetPassword.input';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { transporter } from 'src/common/nodemailer/email.nodemailer';
import { resetPasswordOtp, sendotp } from 'src/common/otp/otp.token';
import { returnString } from 'src/common/return/return.input';



@Injectable()
export class UserService {
    constructor(
       
        @InjectModel(User.name)
        private userModel: Model<User>,
    ){ transporter}
      
      async createuser(createUserinput: CreateUserInput) {
        try {
          const user = await this.userModel.findOne({ email: createUserinput.email });
      
          if (user) {
            throw new ConflictException('User with the same email already exists');
          }
      
          createUserinput.password = await hashed(createUserinput.password);
      
          const newUser = await this.userModel.create({
            ...createUserinput,
          });
      
          return newUser;
      
        } catch (error) {
      
          if (error instanceof ConflictException) {
            throw error;
          }
      
          throw new InternalServerErrorException('Server error while creating your account');
        }
      }
      

    async findalluser() {
        try {
            return await this.userModel.find({
              deleted: false,
              suspended: false
            });  
        } catch (error) {
            console.log(error)
            if (error instanceof ConflictException) {
                throw error;
              }
          
              throw new InternalServerErrorException('Server error');
        }
    }

    async findOneuser(id: string){
     try {
        const user = await this.userModel.findOne({
            _id: id,
            suspended: false,
            deleted: false
        })
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return user
     } catch (error) {
        if (error instanceof NotFoundException) {
            throw error;
          }
      
          throw new InternalServerErrorException('Server error');
     }
    }

  
  async  updateUser(id: string, updateuser: UpdateUserDto, userid: User): Promise<returnString> {

        const user = await this.userModel.findById(id)

        //check if the user with id exist
        if (!user) {
            throw new HttpException('user does not exit', HttpStatus.NOT_FOUND)
        }

        if (user._id.toString() !== userid._id.toString()) {
          console.log(user._id, userid._id)
          throw new HttpException('your are not the owner', HttpStatus.FORBIDDEN)
        }

        await this.userModel.findByIdAndUpdate(id, updateuser, {
            new: true,
            runValidators: true
        })
        return {Response: 'Updated Successfully'};
    }

// user change old password to new password
// userid: CreateUserEntity, 
async changeUserPassword(id: string, userChangepassword: ChangePasswordDTO, userid: User):Promise<returnString> {
  
  try {
    const user = await this.userModel.findById(id)

    if (user._id.toString() !== userid._id.toString()) {
        console.log(user._id.toString(), userid._id.toString())
        throw new ConflictException('you are not the owner account')
    }
       
        if(userChangepassword.password !== userChangepassword.confirmedPassword){
            throw new ConflictException('password and confirmed password do not matched')
        }
    
        if (await comparePassword(userChangepassword.confirmedOldPassword, user.password) === false) {
            throw new ConflictException('your confirmed old password does not matched')
        }
    
        userChangepassword.password = await hashed(userChangepassword.password)
    
         
       await this.userModel.findByIdAndUpdate(user, userChangepassword, {
        new: true,
        runValidators: true
       })
       return {Response: 'password change successfully'}
    
  } catch (error) {
    if (error instanceof ConflictException) {
      throw error
    }
    console.log(error)
    throw new InternalServerErrorException('server error')
    
  }
}

//this is the real one

async  forgotUserPassword(input: ForgetUserPasswordDTO):Promise<returnString> {
    try {
      const user = await this.userModel.findOne({email: input.email})

    if (!user) {
        throw new HttpException('this email does not exist', HttpStatus.UNPROCESSABLE_ENTITY)
    }

 await resetPasswordOtp(user);

    await user.save()
      const emailMessage ={
        from: 'info@paateeng.com',
        to: input.email,
        subject: 'password Reset',
        text: `Click the following link to reset your password: https://yourwebsite.com/reset-password?token=${user.resetPasswordToken}`
        
      }

    try {
        await transporter.sendMail(emailMessage);
        return {Response: `token sent, check your mail`};
      } catch (error) {
        throw new Error(error.message);
      }   
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException('server error ')
    }
}

//user reset password link
async resetPassword(input: ResetPasswordDTO): Promise<returnString> {
const user = await this.userModel.findOne({email: input.email})

if (!user) {
    throw new HttpException('check your email spelling', HttpStatus.UNPROCESSABLE_ENTITY)
}
if (user.resetPasswordToken !== input.token || user.resetTokenExpiration < new Date()) {
    throw new Error('inavlid or expired reset token')
}

if (input.newPassword !== input.confirmedNewPassword) {
    throw new HttpException('password does not matched', HttpStatus.UNPROCESSABLE_ENTITY)
}

user.password = await hashed(input.newPassword);
user.resetPasswordToken = null;
user.resetTokenExpiration = null;

await user.save()
return {
    Response: 'password change successfull'
}
}

}

