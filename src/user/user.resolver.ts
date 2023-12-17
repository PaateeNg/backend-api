import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './input/createuser.input.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './input/updateuser.input';
import { MailService } from 'src/mail/mail.service';
import { ChangePasswordDTO } from './input/changePassword.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { User } from './schema/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserInput } from './input/login.input';
import { verifyEmailDto } from 'src/mail/input/emailverified.input';
import { ForgetUserPasswordDTO } from './input/forgotpassword.input';
import { ResetPasswordDTO } from './input/resetpassword.input';
import { returnString } from '../common/return/return.input';

@Resolver(of=> User)
export class UserResolver {

    constructor(
        private userservice: UserService,
        private mailService: MailService,
        private authService: AuthService
        ){}
    
    @Mutation(returns => returnString)
   async createuser(@Args('createuserinput') createUserinput: CreateUserInput):Promise<returnString>{

        const user = await this.userservice.createuser(createUserinput)
        const iuser = await this.mailService.sendUserConfirmation(user)
        return iuser
    }
//this is mutation for login user

@Mutation(returns => returnString)
async loginuser(@Args('loginInput') logiginInput: LoginUserInput): Promise<returnString> {
   return await this.authService.loginuser(logiginInput) 
 }


    @Mutation(returns=> returnString)
    @UseGuards(GqlAuthGuard)
    updateuser(@Args('id')id: string,
    @Args('updateid') updateuser: UpdateUserDto,
    @GetCurrentGqlUser() user: User
    ):Promise<returnString>{
        return this.userservice.updateUser(id, updateuser, user)
    }


    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    async userprofile(@GetCurrentGqlUser()user: User){
        return user;
    }
    //this route or endpoint will only access by admin or moderator
    //delete a user route here
    //suspense a user route here also
    //unsuspense a user route here
    

    @Mutation(returns => returnString)
    @UseGuards(GqlAuthGuard)
    async userChangePassword(@Args('id') id: string,
    @GetCurrentGqlUser()user: User, 
    @Args('changepasswordInfo') userChangepassword: ChangePasswordDTO):Promise<returnString>{
        return await this.userservice.changeUserPassword(id, userChangepassword, user)
    }

    @Query(returns => [User])
    findusers(){
        return this.userservice.findalluser()
    }

    @Query(returns => User)
    findoneUser(@Args('id') id: string){
        return this.userservice.findOneuser(id)
    }


    @Mutation(returns => returnString)
    forgotUserPassword(@Args('id') id: ForgetUserPasswordDTO):Promise<returnString>{
        return this.userservice.forgotUserPassword(id)
    }

   

    @Mutation(returns => returnString)
    resetuserpassword(@Args('resetPasswordInput') input: ResetPasswordDTO):Promise<returnString>{
        return  this.userservice.resetPassword(input)
    }


    @Mutation(returns => returnString)
    userverifyemail(@Args('emailVerifiedInput') input: verifyEmailDto): Promise<returnString>{
        return  this.mailService.verifyemail(input)
    }
   
}
