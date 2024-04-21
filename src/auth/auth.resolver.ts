import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { returnString } from 'src/common/return/return.input';
import { AuthService } from './auth.service';
import { CreateUserInput, LoginUserInput } from 'src/user/input/user.input.dto';
import { LoginVendorInput, VendorInput } from 'src/vendor/input/vendor.input';
import {
  LoginPlannerInput,
  PlanerInputDto,
} from 'src/planner/input/planner.input.dto';
import {
  ChangePasswordDto,
  ForgetPasswordDTO,
  ResetPasswordDTO,
  VerifyAccountDto,
} from './input-dto/auth-input.dto';
import { GqlAuthGuard } from './guards/graphql.guard';
import { UserDocument } from 'src/user/schema/user.schema';
import { VendorDocument } from 'src/vendor/schema/vendor.schema';
import { Planner, PlannerDocument } from 'src/planner/schema/planner.schema';
import { GetCurrentGqlUser } from './decorators/graphQl.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => returnString)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<returnString> {
    return await this.authService.createUser(createUserInput);
  }

  @Mutation((returns) => returnString)
  async loginUser(
    @Args('loginInput') payload: LoginUserInput,
  ): Promise<returnString> {
    return await this.authService.loginUser(payload);
  }

  @Mutation((returns) => returnString)
  async createVendor(
    @Args('vendorInput') payload: VendorInput,
  ): Promise<returnString> {
    return await this.authService.createVendor(payload);
  }

  @Mutation((returns) => returnString)
  async loginVendor(
    @Args('loginInput') payload: LoginVendorInput,
  ): Promise<returnString> {
    return await this.authService.loginVendor(payload);
  }

  @Mutation((returns) => returnString)
  async createPlanner(
    @Args('plannerInput') payload: PlanerInputDto,
  ): Promise<returnString> {
    return await this.authService.createPlanner(payload);
  }

  @Mutation((returns) => returnString)
  async loginPlanner(
    @Args('loginInput') payload: LoginPlannerInput,
  ): Promise<returnString> {
    return await this.authService.loginPlanner(payload);
  }

  @Mutation((returns) => returnString)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('changePasswordPayload') payload: ChangePasswordDto,
    @GetCurrentGqlUser()
    currentUser: UserDocument | VendorDocument | PlannerDocument,
  ) {
    return await this.authService.changePassword(payload, currentUser);
  }

  @Mutation((returns) => returnString)
  async forgotPassword(
    @Args('password') payload: ForgetPasswordDTO,
  ): Promise<returnString> {
    return await this.authService.forgotPassword(payload);
  }

  @Mutation((returns) => returnString)
  async resetPassword(
    @Args('resetPasswordPayload') payload: ResetPasswordDTO,
  ): Promise<returnString> {
    return await this.authService.resetPassword(payload);
  }

  @Mutation((returns) => returnString)
  async accountVerification(
    @Args('accountVerificationPayload') payload: VerifyAccountDto,
  ): Promise<returnString> {
    return await this.authService.verifyAccount(payload);
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
