import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PlanerInputDto } from './input/createplanner.input';
import { comparePassword, hashed } from 'src/common/hashed/util.hash';
import { updatePlannerDto } from './input/update.planner';
import { GraphQLError } from 'graphql';
import { ChangePlannerPasswordDTO } from './input/changePassword.planner';
import { ForgetPlannerPasswordDTO } from './dto/forgetpassword.dto';
import { ResetPlannerPasswordDTO } from './dto/resetpassword.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Planner } from './schema/planner.schema';
import { Model } from 'mongoose';
import { transporter } from 'src/common/nodemailer/email.nodemailer';
import { resetPasswordOtp } from 'src/common/otp/otp.token';
import { returnString } from 'src/common/return/return.input';

@Injectable()
export class PlannerService {
    constructor(   
        @InjectModel(Planner.name)
        private plannerModel: Model<Planner>,
    ){
        transporter 
    }

    async PlannerRegister(plannerinput: PlanerInputDto) {
      try {
        const planner = await this.plannerModel.findOne({
            email: plannerinput.email
        
    })
    if(planner){
        throw new HttpException('user already exist', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    plannerinput.password= await hashed(plannerinput.password);

   const savedPlanner = await this.plannerModel.create({
        ...plannerinput
    })
    return savedPlanner
      } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        throw new InternalServerErrorException('server error')
      }
        
    }

   
    async updatePlanner(id: string, updateplanner: updatePlannerDto):Promise<returnString> {
        const planner = await this.plannerModel.findById(id)
        
        // if (planner.approved === false) {
        //     throw new GraphQLError('your account is not active yet')
        // }

        if (planner.suspended === true) {
            throw new GraphQLError('Your account is not suspended, kindly chat with one of our moderator');
        }
        // Update vendor with the provided data
        const updatedVendor = await this.plannerModel.findByIdAndUpdate(
            id,
            updateplanner,
            {
                new: true,
                runValidators: true
            }
        );
    
        if (!updatedVendor) {
            throw new GraphQLError('Failed to update vendor');
        }
    
        return {
            Response: "updated Successfully"
        };
    }

    async findallplanner() {
        return await this.plannerModel.find({
                suspended: false,
                approved: true
        })
    }

    //find one planner by id

    async findOneplanner(id: string) {
      try {
        const planner =  await this.plannerModel.findOne({
            _id: id,
            suspended: false,
            approved: true
    })
    if (!planner) {
        throw new NotFoundException('planner not found')
    }

    return planner;

      } catch (error) {
        if (error instanceof NotFoundException) {
            throw error
        }
        throw new InternalServerErrorException('server error')
      }
    }

    //change password

    async changePlannerPassword(id: string, changePlannerPassword: ChangePlannerPasswordDTO):Promise<returnString> {
        const planner = await this.plannerModel.findById(id)

        if (changePlannerPassword.password !== changePlannerPassword.confirmedPassword) {
            throw new GraphQLError('password not matched')
        }

        if (await comparePassword(changePlannerPassword.confirmedPassword, planner.password) === false) {
            throw new GraphQLError('your confirmed old password does not matched')
        }
        
        if (await comparePassword(changePlannerPassword.password, planner.password) === true) {
            throw new GraphQLError('your new can be same with old password')
        }

        planner.password = await hashed(changePlannerPassword.password)
        
        await this.plannerModel.findByIdAndUpdate(id, changePlannerPassword, {
            new: true,
            runValidators: true
           })
           return { Response: 'password changed successfully'}
       
    }


    //real

    async  forgetPlannerPassword(input: ForgetPlannerPasswordDTO):Promise<returnString> {
        const planner = await this.plannerModel.findOne({
       
                email:input.email
            
          })

          if (!planner) {
            throw new HttpException('email does not exit', HttpStatus.UNPROCESSABLE_ENTITY)
          }

          await resetPasswordOtp(planner)

          await planner.save()

          const emailMessage ={
            from: 'info@paateeng.com',
            to: input.email,
            subject: 'password Reset',
            Text: `Click the following link to reset your password: https://yourwebsite.com/reset-password?token=${planner.resetPasswordToken}`
          }
    
          try {
             await transporter.sendMail(emailMessage);
            return {Response: `token has been sent to email ${input.email}`};
          } catch (error) {
            throw new Error(error.message);
          } 
    }
    
    async resetPlannerPassword(input: ResetPlannerPasswordDTO):Promise<returnString> {
      const planner = await this.plannerModel.findOne({
            email:input.email
      })

      if (!planner) {
        throw new HttpException('check your email spelling', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if (planner.resetPasswordToken !== input.token || planner.resetTokenExpiration < new Date()) {
        throw new Error('inavlid or expired reset token')
    }
    
    if (input.newPassword !== input.confirmedNewPassword) {
        throw new HttpException('password does not matched', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    
    planner.password = await hashed(input.newPassword);
    planner.resetPasswordToken = null;
    planner.resetTokenExpiration = null;
    
    await planner.save()

    return {
        Response: 'password change successfull'
    }
    
    }  
}
