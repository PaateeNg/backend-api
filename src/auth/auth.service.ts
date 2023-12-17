import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { comparePassword } from 'src/common/hashed/util.hash';
import { LoginUserDto } from 'src/user/dto/loginuser.dto';
import { JwtService } from '@nestjs/jwt';
//import { LoginVendorDto } from 'src/vendor/dto/login.vendor.dto';
import { LoginPlannerDto } from 'src/planner/dto/login.planner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { Planner } from 'src/planner/schema/planner.schema';
import { LoginUserInput } from 'src/user/input/login.input';
import { LoginVendorInput } from 'src/vendor/input/loginvendor.input';
import { LoginVendorDto } from 'src/vendor/dto/login.vendor.dto';
import { returnString } from 'src/common/return/return.input';
import { LoginPlannerInput } from 'src/planner/input/loginplanner.input';

@Injectable()
export class AuthService {
    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Vendor.name) private vendorModel: Model<User>,
    @InjectModel(Planner.name) private plannerModel: Model<User>,
    private jwtservice: JwtService,
   
    ){

    }
    
   async  loginuser(logindto: LoginUserInput):Promise<returnString> {
        const user = await this.userModel.findOne({email: logindto.email})

        if(!user){
            throw new HttpException('check your information and try it again', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        if((await comparePassword(logindto.password, user.password))===false){
            throw new HttpException('your password is incorrect', 422)
        }

        const payload = {
            user: user.id
         };
     
         //console.log(`${user.firstName} logged in successfulyy`)
        //  const token = await this.jwtservice.sign(payload);
        //  console.log({token})
        //  return    token
         return {
            Response: await this.jwtservice.sign(payload)
         }

        }
     

  

   async loginvendor(loginvendordto: LoginVendorInput) : Promise<returnString>{
   
        const vendor = await this.vendorModel.findOne({
                email: loginvendordto.email  
        })
        if (!vendor) {
            throw new HttpException('check your credentials', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        if((await comparePassword(loginvendordto.password, vendor.password))===false){
            throw new HttpException('your password is incorrect', 422)
        }

        const payload = {
             user: vendor.id,
         };
     
         return {
            Response: this.jwtservice.sign(payload),
         }

        

    }

    async loginplanner(loginplannerdto: LoginPlannerInput): Promise<returnString> {
        const planner = await this.plannerModel.findOne({email: loginplannerdto.email})

        if (!planner) {
            throw new HttpException('check your credentials', HttpStatus.UNPROCESSABLE_ENTITY)
        }
         if((await comparePassword(loginplannerdto.password, planner.password))===false){
            throw new HttpException('your password is incorrect', 422)
        }
      
        const payload = {
            user: planner.id,
            firstname: planner.firstName
         };
     
         return {
            Response: this.jwtservice.sign(payload),
         }

        
    }


    //
   
    
      //very importance without this jwt can not grap the current logged in user
      //this function is call in strategy file check to understand
      async getUserjwt(id: string){
        const user = await this.userModel.findOne({_id: id})
        const planner = await this.plannerModel.findOne({_id:id})
        const vendor = await this.vendorModel.findOne({_id:id})

        if (user) {
           return user;
        }
        if (planner) {
           return planner
        }
        if (vendor) {
           return vendor
        }
   }

}
