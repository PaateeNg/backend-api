import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, hashed } from 'src/common/hashed/util.hash';
import { JwtService } from '@nestjs/jwt';

import { returnString } from 'src/common/return/return.input';
import { UserService } from 'src/user/user.service';
import { PlannerService } from 'src/planner/planner.service';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateUserInput, LoginUserInput } from 'src/user/input/user.input.dto';
import { LoginVendorInput, VendorInput } from 'src/vendor/input/vendor.input';
import {
  LoginPlannerInput,
  PlanerInputDto,
} from 'src/planner/input/planner.input.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { Vendor, VendorDocument } from 'src/vendor/schema/vendor.schema';
import { PlannerDocument } from 'src/planner/schema/planner.schema';
import {
  ChangePasswordDto,
  CreateInputDto,
  ForgotPasswordDTO,
  LoginInputDto,
  RequestOtpDTO,
  ResetPasswordDTO,
  VerifyAccountDto,
} from './input-dto/auth-input.dto';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';
import { UserTypeENum } from './enum/auth.enum';
import { CreateAccountWithOughtDto } from './input-dto/auth-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private plannerService: PlannerService,
    private vendorService: VendorService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async createAccount(payload: CreateInputDto) {
    try {
      const { userType } = payload;

      if (userType === UserTypeENum.asUser) {
        return await this.createUser(payload);
      } else if (userType === UserTypeENum.asVendor) {
        return await this.createVendor(payload);
      } else if (userType === UserTypeENum.asPlanner) {
        return await this.createPlanner(payload);
      }

      // return {
      //   Response: 'User Sign Up Successfully, Kindly Verify Your Account',
      // };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async login(payload: LoginInputDto) {
    const { loginAs, email, password } = payload;
    let loginDetails;

    if (loginAs === UserTypeENum.asUser) {
      loginDetails = await this.loginUser({
        email: email,
        password: password,
      });
    } else if (loginAs === UserTypeENum.asVendor) {
      loginDetails = await this.loginVendor({
        email: email,
        password: password,
      });
    } else if (loginAs === UserTypeENum.asPlanner) {
      loginDetails = await this.loginPlanner({
        email: email,
        password: password,
      });
    }
    return loginDetails;
  }

  async createAccountWithGoogleOught(payload: CreateAccountWithOughtDto) {
    const { userType, email } = payload;

    let details;

    if (userType === UserTypeENum.asUser) {
      details = await this.createUserWithGoogle(payload);
    } else if (userType === UserTypeENum.asVendor) {
      details = await this.createVendorWithGoogle(payload);
    } else if (userType === UserTypeENum.asPlanner) {
      details = await this.createPlannerWithGoogle(payload);
    }

    return details;
  }

  async createUser(payload: CreateUserInput) {
    try {
      const { email } = payload;

      const userExist = await this.userService.getByEmail(email);

      if (userExist) {
        throw new BadRequestException('user Already Exist');
        // if (!userExist.isAccountVerified) {
        //   await this.otpService.sendOtp({
        //     email: userExist.email,
        //     type: OtpEnumType.AccountVerification,
        //   });
        //   return {
        //     Response: 'User Sign Up Successfully, Kindly Verify Your Account',
        //   };
        // } else if (userExist.isAccountVerified) {
        //   throw new Error('User with the same email already exists');
        // }
      }

      await this.userService.createUser(payload);
      return {
        Response: 'User Sign Up Successfully, Kindly Verify Your Account',
      };
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async loginUser(payload: LoginUserInput): Promise<UserDocument> {
    try {
      const { email, password } = payload;
      const user = await this.userService.getByEmail(email);

      if (!user) {
        throw new BadRequestException('Invalid User Credential');
      }

      if (user.isGoogleAuth) {
        throw new BadRequestException(`Can't Proceed`);
      }
      if ((await comparePassword(password, user.password)) === false) {
        throw new BadRequestException('your password is incorrect');
      }

      // if (!user.isAccountVerified) {
      //   throw new UnauthorizedException(
      //     'You have to verify your account before logging in',
      //   );
      // }

      const accessToken = await this.jwtToken(user);
      user.accessToken = accessToken.Response;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof BadRequestException || UnauthorizedException) {
        return error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createVendor(payload: VendorInput) {
    const { email } = payload;

    try {
      const vendorExist = await this.vendorService.getByEmail(email);

      if (vendorExist) {
        throw new BadRequestException('Vendor Already Exist');
        // if (!vendorExist.isAccountVerified) {
        //   await this.otpService.sendOtp({
        //     email: vendorExist.email,
        //     type: OtpEnumType.AccountVerification,
        //   });

        //   return {
        //     Response: 'Vendor Sign Up Successfully, Kindly Verify Your Account',
        //   };
        // } else if (vendorExist.isAccountVerified) {
        //   throw new BadRequestException('Vendor Already Exist');
        // }
      }

      await this.vendorService.createVendor(payload);
      return {
        Response: 'Vendor Sign Up Successfully, Kindly Verify Your Account',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async loginVendor(payload: LoginVendorInput): Promise<VendorDocument> {
    const { email, password } = payload;
    try {
      const vendor = await this.vendorService.getByEmail(email);
      if (!vendor) {
        throw new NotFoundException('Vendor Not Found ');
      }

      if ((await comparePassword(password, vendor.password)) === false) {
        throw new BadRequestException('Incorrect Password');
      }

      // if (!vendor.isAccountVerified) {
      //   throw new BadRequestException(
      //     'You have to verify your account before logging in',
      //   );
      // }

      const accessToken = await this.jwtToken(vendor);

      vendor.accessToken = accessToken.Response;
      await vendor.save();
      return vendor;
    } catch (error) {
      if (error instanceof NotFoundException || BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createPlanner(payload: PlanerInputDto) {
    const { email } = payload;

    try {
      const plannerExist = await this.plannerService.getByEmail(email);

      if (plannerExist) {
        throw new BadRequestException('User Already Exist');
        // if (!plannerExist.isAccountVerified) {
        //   await this.otpService.sendOtp({
        //     email: email,
        //     type: OtpEnumType.AccountVerification,
        //   });
        //   return {
        //     Response: 'Planner Sign Up Success, Kindly Verify Your Account',
        //   };
        // } else if (plannerExist.isAccountVerified) {
        //   throw new BadRequestException('User Already Exist');
        // }
      }

      await this.plannerService.createPlanner(payload);
      return {
        Response: 'Planner Sign Up Success, Kindly Verify Your Account',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async loginPlanner(payload: LoginPlannerInput): Promise<PlannerDocument> {
    const { email, password } = payload;
    try {
      const planner = await this.plannerService.getByEmail(email);

      if (!planner) {
        throw new BadRequestException('Invalid Credential Provided');
      }

      if ((await comparePassword(password, planner.password)) === false) {
        throw new BadRequestException('your password is incorrect');
      }

      // if (!planner.isAccountVerified) {
      //   throw new BadRequestException(
      //     'You have to verify your account before logging in',
      //   );
      // }

      const accessToken = await this.jwtToken(planner);
      planner.accessToken = accessToken.Response;
      await planner.save();

      return planner;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createUserWithGoogle(
    payload: CreateAccountWithOughtDto,
  ): Promise<UserDocument> {
    const { email } = payload;

    const userExist = await this.userService.getByEmail(email);

    if (userExist) {
      if (userExist.isGoogleAuth) {
        const accessToken = await this.jwtToken(userExist);
        userExist.accessToken = accessToken.Response;
        await userExist.save();
        return userExist;
      } else {
        throw new BadRequestException(`Can't Proceed`);
      }
    }
    return await this.userService.createUserWithGoogle(payload);
  }

  async createVendorWithGoogle(
    payload: CreateAccountWithOughtDto,
  ): Promise<VendorDocument> {
    const { email } = payload;

    const userExist = await this.vendorService.getByEmail(email);

    if (userExist) {
      if (userExist.isGoogleAuth) {
        const accessToken = await this.jwtToken(userExist);
        userExist.accessToken = accessToken.Response;
        await userExist.save();
        return userExist;
      } else {
        throw new BadRequestException(`Can't Proceed`);
      }
    }
    return await this.vendorService.createVendorWithGoogle(payload);
  }

  async createPlannerWithGoogle(
    payload: CreateAccountWithOughtDto,
  ): Promise<PlannerDocument> {
    const { email } = payload;

    const userExist = await this.plannerService.getByEmail(email);

    if (userExist) {
      if (userExist.isGoogleAuth) {
        const accessToken = await this.jwtToken(userExist);
        userExist.accessToken = accessToken.Response;
        await userExist.save();
        return userExist;
      } else {
        throw new BadRequestException(`Can't Proceed`);
      }
    }
    return await this.plannerService.createPlannerWithGoogle(payload);
  }

  async getUserJwt(userId: string) {
    const [vendor, user, planner] = await Promise.all([
      this.vendorService.getById(userId),
      this.userService.getById(userId),
      this.plannerService.getById(userId),
    ]);

    const iUser = user || planner || vendor;

    if (!iUser) {
      throw new BadRequestException('Invalid User Token');
    }

    return iUser;
  }

  async changePassword(
    payload: ChangePasswordDto,
    currentUser: UserDocument | VendorDocument | PlannerDocument,
  ): Promise<returnString> {
    const { newPassword, oldPassword } = payload;
    try {
      if (currentUser.isAccountSuspended) {
        throw new Error('Your account is suspended. Please contact support.');
      }

      if (
        (await comparePassword(oldPassword, currentUser.password)) === false
      ) {
        throw new Error('Your old password does not match.');
      }

      currentUser.password = await hashed(newPassword);

      await currentUser.save();

      return { Response: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server error.');
    }
  }

  async forgotPassword(payload: ForgotPasswordDTO): Promise<returnString> {
    const { email, userType } = payload;

    try {
      let user: any;
      if (userType === UserTypeENum.asUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === UserTypeENum.asVendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === UserTypeENum.asPlanner) {
        user = await this.plannerService.getByEmail(email);
      }

      if (!user) {
        throw new BadRequestException('Invalid email');
      }

      await this.otpService.sendOtp({
        email: email,
        type: OtpEnumType.ResetPassword,
      });
      return {
        Response: 'Otp Sent',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async resetPassword(payload: ResetPasswordDTO) {
    const { email, newPassword, code, userType } = payload;

    try {
      let user: any;

      if (userType === UserTypeENum.asUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === UserTypeENum.asVendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === UserTypeENum.asPlanner) {
        user = await this.plannerService.getByEmail(email);
      }

      if (!user) {
        throw new BadRequestException('Invalid Email');
      }

      const otp = await this.otpService.verifyOtp({
        email,
        code,
        type: OtpEnumType.ResetPassword,
      });

      user.password = await hashed(newPassword);

      await user.save();

      return {
        Response: 'Password Reset Successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async verifyAccount(payload: VerifyAccountDto): Promise<returnString> {
    const { email, code, userType } = payload;
    try {
      let user: any;

      if (userType === UserTypeENum.asUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === UserTypeENum.asVendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === UserTypeENum.asPlanner) {
        user = await this.plannerService.getByEmail(email);
      }

      if (!user) {
        throw new BadRequestException('Invalid Email');
      }

      await this.otpService.verifyOtp({
        email,
        code,
        type: OtpEnumType.AccountVerification,
      });

      user.isAccountVerified = true;

      await user.save();

      return {
        Response: 'Account is Now Verified',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async requestOtp(payload: RequestOtpDTO): Promise<returnString> {
    const { email, userType, type } = payload;

    try {
      let user: any;
      if (userType === UserTypeENum.asUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === UserTypeENum.asVendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === UserTypeENum.asPlanner) {
        user = await this.plannerService.getByEmail(email);
      }

      if (!user) {
        throw new BadRequestException('Invalid email');
      }

      await this.otpService.sendOtp({
        email: email,
        type: type,
      });
      return {
        Response: 'Otp Sent',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async jwtToken(payload: any) {
    const jwtPayload = {
      id: payload._id,
    };

    return {
      Response: this.jwtService.sign(jwtPayload),
    };
  }
}
