import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private plannerService: PlannerService,
    private vendorService: VendorService,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: CreateUserInput) {
    try {
      const { email } = payload;

      const userExist = await this.userService.getByEmail(email);

      if (userExist) {
        throw new Error('User with the same email and phone already exists');
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
        throw new Error('Vendor Already Exist');
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

      if ((await comparePassword(password, vendor.password)) === false) {
        throw new Error('Incorrect Password');
      }

      return await this.jwtToken(vendor);
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createPlanner(payload: PlanerInputDto) {
    const { email, businessName } = payload;

    try {
      const plannerExist =
        await this.plannerService.getPlanerByEmailOrBusinessName(
          email,
          businessName,
        );

      if (plannerExist) {
        throw new Error('Planner Already Exist');
      }

      await this.plannerService.createPlanner(payload);

      return {
        Response: 'Planner Sign Up Success, Kindly Verify Your Account',
      };
    } catch (error) {
      if (error instanceof Error) {
        return { Response: error.message };
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async loginPlanner(payload: LoginPlannerInput): Promise<returnString> {
    const { email, password } = payload;
    const planner = await this.plannerService.getByEmail(email);

    if ((await comparePassword(password, planner.password)) === false) {
      throw new BadRequestException('your password is incorrect');
    }

    return await this.jwtToken(planner);
  }

  async getUserJwt(userId: string) {
    const [vendor, user, planner] = await Promise.all([
      this.vendorService.getByIdForGUse(userId),
      this.userService.getByIdForGUse(userId),
      this.plannerService.getByIdForGUse(userId),
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
        throw new UnauthorizedException(
          'Your account is suspended. Please contact support.',
        );
      }

      if (
        (await comparePassword(oldPassword, currentUser.password)) === false
      ) {
        throw new BadRequestException('Your old password does not match.');
      }

      currentUser.password = await hashed(newPassword);

      await currentUser.save();

      return { Response: 'Password changed successfully.' };
    } catch (error) {
      throw new InternalServerErrorException('Server error.');
    }
  }

  async forgotPassword(payload: ForgetPasswordDTO) {
    const { email } = payload;

    const [user, vendor, planner] = await Promise.all([
      this.userService.getByEmail(email),
      this.vendorService.getByEmail(email),
      this.plannerService.getByEmail(email),
    ]);

    if (user || vendor || planner) {
      //implement otp service here
      return {
        Response: 'Otp Sent',
      };
    }
  }

  async resetPassword(payload: ResetPasswordDTO) {
    const { email, newPassword, code } = payload;

    const [user, vendor, planner] = await Promise.all([
      this.userService.getByEmail(email),
      this.vendorService.getByEmail(email),
      this.plannerService.getByEmail(email),
    ]);

    // await this.optService.verifyOtp({email, code, type: OtpEnumType.ResetPassword})

    const iUser = user || vendor || planner;

    iUser.password = await hashed(newPassword);

    await iUser.save();

    return {
      Response: 'Password Reset Successfully',
    };
  }

  async verifyAccount(payload: VerifyAccountDto): Promise<returnString> {
    const { email, code } = payload;

    const [user, vendor, planner] = await Promise.all([
      this.userService.getByEmail(email),
      this.vendorService.getByEmail(email),
      this.plannerService.getByEmail(email),
    ]);

    // await this.optService.verifyOtp({email, code, type: OtpEnumType.VerifyAccount});

    const iUser = user || vendor || planner;

    iUser.isAccountVerified = true;

    await iUser.save();

    return {
      Response: 'Account is Now Verified',
    };
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
