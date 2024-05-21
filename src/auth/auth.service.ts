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
import { VendorDocument } from 'src/vendor/schema/vendor.schema';
import { PlannerDocument } from 'src/planner/schema/planner.schema';
import {
  ChangePasswordDto,
  ForgetPasswordDTO,
  ResetPasswordDTO,
  VerifyAccountDto,
} from './input-dto/auth-input.dto';
import { GraphQLError } from 'graphql';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';
import { forgotPasswordUserType } from './enum/auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private plannerService: PlannerService,
    private vendorService: VendorService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async createUser(payload: CreateUserInput) {
    try {
      const { email } = payload;

      const userExist = await this.userService.getByEmail(email);

      if (userExist) {
        if (!userExist.isAccountVerified) {
          await this.otpService.sendOtp({
            email: userExist.email,
            type: OtpEnumType.AccountVerification,
          });

          return {
            Response: 'User Sign Up Successfully, Kindly Verify Your Account',
          };
        } else if (userExist.isAccountVerified) {
          throw new Error('User with the same email already exists');
        }
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

  async loginUser(payload: LoginUserInput): Promise<returnString> {
    try {
      const { email, password } = payload;
      const user = await this.userService.getByEmail(email);

      if (!user) {
        throw new Error('Invalid User Credential');
      }

      if ((await comparePassword(password, user.password)) === false) {
        throw new Error('your password is incorrect');
      }

      if (!user.isAccountVerified) {
        throw new Error('You have to verify your account before logging in');
      }

      return await this.jwtToken(user);
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createVendor(payload: VendorInput) {
    const { email } = payload;

    try {
      const vendorExist = await this.vendorService.getByEmail(email);

      if (vendorExist) {
        if (!vendorExist.isAccountVerified) {
          await this.otpService.sendOtp({
            email: vendorExist.email,
            type: OtpEnumType.AccountVerification,
          });

          return {
            Response: 'Vendor Sign Up Successfully, Kindly Verify Your Account',
          };
        } else if (vendorExist.isAccountVerified) {
          throw new Error('Vendor Already Exist');
        }
      }

      await this.vendorService.createVendor(payload);

      return {
        Response: 'Vendor Sign Up Successfully, Kindly Verify Your Account',
      };
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async loginVendor(payload: LoginVendorInput): Promise<returnString> {
    const { email, password } = payload;
    try {
      const vendor = await this.vendorService.getByEmail(email);
      if (!vendor) {
        throw new NotFoundException('Vendor Not Found ');
      }

      if ((await comparePassword(password, vendor.password)) === false) {
        throw new BadRequestException('Incorrect Password');
      }

      if (!vendor.isAccountVerified) {
        throw new BadRequestException(
          'You have to verify your account before logging in',
        );
      }

      return await this.jwtToken(vendor);
    } catch (error) {
      if (error instanceof NotFoundException || BadRequestException) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createPlanner(payload: PlanerInputDto) {
    const { email } = payload;

    try {
      const plannerExist = await this.plannerService.getByEmail(email);

      if (plannerExist) {
        throw new BadRequestException('Planner Already Exist');
      }

      await this.plannerService.createPlanner(payload);

      return {
        Response: 'Planner Sign Up Success, Kindly Verify Your Account',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async loginPlanner(payload: LoginPlannerInput): Promise<returnString> {
    const { email, password } = payload;
    try {
      const planner = await this.plannerService.getByEmail(email);

      if (!planner) {
        throw new Error('Invalid Credential Provided');
      }

      if ((await comparePassword(password, planner.password)) === false) {
        throw new BadRequestException('your password is incorrect');
      }

      if (!planner.isAccountVerified) {
        throw new Error('You have to verify your account before logging in');
      }

      return await this.jwtToken(planner);
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async getUserJwt(userId: string) {
    const [vendor, user, planner] = await Promise.all([
      this.vendorService.getById(userId),
      this.userService.getById(userId),
      this.plannerService.getById(userId),
    ]);

    const iUser = user || planner || vendor;

    if (!iUser) {
      throw new Error('Invalid User Token');
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

  async forgotPassword(payload: ForgetPasswordDTO): Promise<returnString> {
    const { email, userType } = payload;

    try {
      let user: any;
      if (userType === forgotPasswordUserType.IsUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === forgotPasswordUserType.Vendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === forgotPasswordUserType.IsPlanner) {
        user = await this.plannerService.getByEmail(email);
      }

      if (!user) {
        throw new Error('Invalid email');
      }

      if (user) {
        await this.otpService.sendOtp({
          email: email,
          type: OtpEnumType.ResetPassword,
        });
        return {
          Response: 'Otp Sent',
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async resetPassword(payload: ResetPasswordDTO) {
    const { email, newPassword, code, userType } = payload;

    try {
      let user: any;

      if (userType === forgotPasswordUserType.IsUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === forgotPasswordUserType.Vendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === forgotPasswordUserType.IsPlanner) {
        user = await this.plannerService.getByEmail(email);
      }

      if (!user) {
        throw new Error('Invalid user');
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
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async verifyAccount(payload: VerifyAccountDto): Promise<returnString> {
    const { email, code, userType } = payload;
    try {
      let user: any;

      if (userType === forgotPasswordUserType.IsUser) {
        user = await this.userService.getByEmail(email);
      }

      if (userType === forgotPasswordUserType.Vendor) {
        user = await this.vendorService.getByEmail(email);
      }

      if (userType === forgotPasswordUserType.IsPlanner) {
        user = await this.plannerService.getByEmail(email);
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
      if (error instanceof Error) {
        return { Response: error.message };
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
