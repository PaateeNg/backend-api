import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorInput } from './input/vendor.input';
import { VendorService } from './vendor.service';
import { UpdateVendorDto } from './input/update.vendor.input';
import { ChangeVendorPasswordDTO } from './input/changeVendorPassword.input';
import { MailService } from 'src/mail/mail.service';
import { Vendor } from './schema/vendor.schema';
import { LoginVendorInput } from './input/loginvendor.input';
import { AuthService } from 'src/auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { ForgetVendorPasswordDTO } from './input/forgotpassword.input';
import { ResetVendorPasswordDTO } from './input/resetpassword.input';
import { verifyEmailDto } from 'src/mail/input/emailverified.input';
import { returnString } from 'src/common/return/return.input';

@Resolver(of => Vendor)
export class VendorResolver {
    constructor(
        private vendorService: VendorService,
        private mailService: MailService,
        private authService: AuthService
        ){}

    @Mutation(returns => returnString)
    async vendorRegister(@Args('vendorinput') vendorinput: VendorInput):Promise<returnString>{
        const vendor= await this.vendorService.vendorRegister( vendorinput)
       const ivendor = await this.mailService.sendVendorConfirmation(vendor)
        return ivendor
    }


    //login a vendor

    @Mutation(returns => returnString)
    async loginvendor(@Args('loginInput') loginvendordto: LoginVendorInput): Promise<returnString> {
    return await this.authService.loginvendor(loginvendordto) 
    }

    //current logged in vendor
    @Query(returns => Vendor)
    @UseGuards(GqlAuthGuard)
    async vendorprofile(@GetCurrentGqlUser()vendor: Vendor){
        return vendor;
    }
    
    @Mutation(returns => returnString)
    updatevendor(@Args('id') id: string, @Args('updateid') updatevendor: UpdateVendorDto):Promise<returnString>{
        return this.vendorService.updatevendor(id, updatevendor)
    }

    @Query(returns => [Vendor])
    findvendors(){
        return this.vendorService.findallvendors()
    }

    @Query(returns => Vendor)
    findvendorById(@Args('id') id: string){
        return this.vendorService.findVendorById(id)
    }

    @Mutation(returns => Vendor)
    changevendorPassword(@Args('id') id: string, @Args('changepasswordInfo') changeVendorpassword: ChangeVendorPasswordDTO){
        return this.vendorService.changeVendorPassword(id, changeVendorpassword)
    }


    @Mutation(returns => Vendor)
    forgotVendorPassword(@Args('id') id: ForgetVendorPasswordDTO){
        return this.vendorService.forgetVendorPassword(id)
    }


   

    @Mutation(returns => Vendor)
    resetvendorpassword(@Args('resetPasswordInput') input: ResetVendorPasswordDTO){
        return  this.vendorService.resetVendorPassword(input)
    }


    @Mutation(returns => returnString)
    vendorverifyemail(@Args('emailVerifiedInput') input: verifyEmailDto): Promise<returnString>{
        return  this.mailService.verifyemail(input)
    }

}
