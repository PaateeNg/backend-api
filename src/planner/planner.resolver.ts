import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlanerInputDto } from './input/createplanner.input';
import { PlannerService } from './planner.service';
import { updatePlannerDto } from './input/update.planner';
import { ChangePlannerPasswordDTO } from './input/changePassword.planner';
import { MailService } from 'src/mail/mail.service';
import { Planner } from './schema/planner.schema';
import { AuthService } from 'src/auth/auth.service';
import { LoginPlannerInput } from './input/loginplanner.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { ForgetPlannerPasswordDTO } from './input/forgotpassword.input';
import { verifyEmailDto } from 'src/mail/input/emailverified.input';
import { ResetPlannerPasswordDTO } from './input/resetpassword.input';
import { returnString } from 'src/common/return/return.input';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Resolver(of => Planner)
export class PlannerResolver {

    constructor(
        private plannerService: PlannerService,
        private mailService: MailService,
        private authService: AuthService
        ){}

    
    @Mutation(returns => returnString)
    async plannerRegister(@Args('plannerinput') plannerinput: PlanerInputDto):Promise<returnString>{
        const planner = await this.plannerService.PlannerRegister( plannerinput)

       const iplanner = await this.mailService.sendPlannerConfirmation(planner)
        return iplanner
        
    }

    @Mutation(returns => returnString)
    async loginplanner(@Args('loginInput') loginplannerdto: LoginPlannerInput): Promise<returnString> {
    
       return await this.authService.loginplanner(loginplannerdto) 
     }

     @Query(returns => Planner)
     @UseGuards(GqlAuthGuard)
     async plannerProfile(@GetCurrentGqlUser()planner: Planner){
         return planner;
     }

    @Mutation(returns => returnString)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.PLANNER, Role.MODERATOR)
    updatePlanner(@Args('id') id: string, @Args('updateplannerinput') updateplanner: updatePlannerDto):Promise<returnString>{
        return this.plannerService.updatePlanner(id, updateplanner)
    }

    @Query(returns => [Planner])
    findplanners(){
        return this.plannerService.findallplanner()
    }

    @Query(returns => Planner)
    findOneplanner(@Args('id') id: string){
        return this.plannerService.findOneplanner(id)
    }
    @Mutation(returns => returnString)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.PLANNER, Role.MODERATOR)
    async changePlannerPassword(@Args('id') id: string, @Args('chnagePlannerPassword') changePlannerPassword: ChangePlannerPasswordDTO):Promise<returnString>{
        return this.plannerService.changePlannerPassword(id, changePlannerPassword)
    }

    @Mutation(returns => returnString)
    forgotPlannerPassword(@Args('id') id: ForgetPlannerPasswordDTO):Promise<returnString>{
        return this.plannerService.forgetPlannerPassword(id)
    }

   

    @Mutation(returns => returnString)
    resetplannerpassword(@Args('resetPasswordInput') input: ResetPlannerPasswordDTO):Promise<returnString>{
        return this.plannerService.resetPlannerPassword(input)
    }


    @Mutation(returns => returnString)
    plannerverifyemail(@Args('emailVerifiedInput') input: verifyEmailDto):Promise<returnString>{
        return  this.mailService.verifyemail(input)
    }

}
