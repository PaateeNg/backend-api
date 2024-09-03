import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { returnString } from 'src/common/return/return.input';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDTO,
  LoginInputDto,
  RequestOtpDTO,
  ResetPasswordDTO,
  VerifyAccountDto,
} from './input-dto/auth-input.dto';
import { GqlAuthGuard } from './guards/graphql.guard';
import { UserDocument, User } from 'src/user/schema/user.schema';
import { VendorDocument, Vendor } from 'src/vendor/schema/vendor.schema';
import { PlannerDocument, Planner } from 'src/planner/schema/planner.schema';
import { GetCurrentGqlUser } from './decorators/graphQl.decorator';
import { CreateAccountWithOughtDto } from './input-dto/auth-input.dto';
import { CreateInputDto } from './input-dto/auth-input.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => returnString)
  async createAccount(@Args('payload') payload: CreateInputDto): Promise<any> {
    return await this.authService.createAccount(payload);
  }

  @Mutation((returns) => User)
  async createAccountWithGoogleOught(
    @Args('payload') payload: CreateAccountWithOughtDto,
  ): Promise<UserDocument> {
    return await this.authService.createAccountWithGoogleOught(payload);
  }

  @Mutation((returns) => User)
  async login(@Args('payload') payload: LoginInputDto) {
    return await this.authService.login(payload);
  }

  @Mutation((returns) => returnString)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('payload') payload: ChangePasswordDto,
    @GetCurrentGqlUser()
    currentUser: UserDocument | VendorDocument | PlannerDocument,
  ) {
    return await this.authService.changePassword(payload, currentUser);
  }

  @Mutation((returns) => returnString)
  async forgotPassword(
    @Args('payload') payload: ForgotPasswordDTO,
  ): Promise<returnString> {
    return await this.authService.forgotPassword(payload);
  }

  @Mutation((returns) => returnString)
  async resetPassword(
    @Args('payload') payload: ResetPasswordDTO,
  ): Promise<returnString> {
    return await this.authService.resetPassword(payload);
  }

  @Mutation((returns) => returnString)
  async accountVerification(
    @Args('payload') payload: VerifyAccountDto,
  ): Promise<returnString> {
    return await this.authService.verifyAccount(payload);
  }

  @Mutation((returns) => returnString)
  async requestOTP(
    @Args('payload') payload: RequestOtpDTO,
  ): Promise<returnString> {
    return await this.authService.requestOtp(payload);
  }

  @Query((returns) => returnString)
  @UseGuards(GqlAuthGuard)
  async currentUser(
    @GetCurrentGqlUser()
    currentUser: UserDocument | VendorDocument | PlannerDocument,
  ) {
    return currentUser;
  }
}
