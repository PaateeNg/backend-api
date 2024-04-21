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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private plannerService: PlannerService,
    private vendorService: VendorService,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: CreateUserInput) {
    const { email, phoneNumber } = payload;

    const userExist = await this.userService.getByEmailOrPhoneNumber(
      email,
      phoneNumber,
    );

    if (userExist) {
      throw new BadRequestException('User with the same email already exists');
    }

    await this.userService.createUser(payload);

    return {
      Response: 'User Sign Up Successfully, Kindly Verify Your Account',
    };
  }

  async loginUser(payload: LoginUserInput): Promise<returnString> {
    const { email, password } = payload;
    const user = await this.userService.getByEmail(email);

    if ((await comparePassword(password, user.password)) === false) {
      throw new BadRequestException('your password is incorrect');
    }

    const jwtPayload = {
      user: user._id,
    };

    return {
      Response: this.jwtService.sign(jwtPayload),
    };
  }

  async createVendor(payload: VendorInput) {
    const { email, businessName } = payload;

    const vendorExist = await this.vendorService.getByEmailOrBusinessName(
      email,
      businessName,
    );

    if (vendorExist) {
      throw new BadRequestException('Vendor Already Exist');
    }

    await this.vendorService.createVendor(payload);

    return {
      Response: 'Vendor Sign Up Successfully, Kindly Verify Your Account',
    };
  }

  async loginVendor(payload: LoginVendorInput): Promise<returnString> {
    const { email, password } = payload;
    const vendor = await this.vendorService.getByEmail(email);

    if ((await comparePassword(password, vendor.password)) === false) {
      throw new BadRequestException('Incorrect Password');
    }

    const jwtPayload = {
      user: vendor._id,
    };

    return {
      Response: this.jwtService.sign(jwtPayload),
    };
  }

  async createPlanner(payload: PlanerInputDto) {
    const { email, businessName } = payload;

    const plannerExist =
      await this.plannerService.getVendorByEmailOrBusinessName(
        email,
        businessName,
      );

    if (plannerExist) {
      throw new BadRequestException('Planner Already Exist');
    }

    await this.plannerService.createPlanner(payload);

    return {
      Response: 'Planner Sign Up Success, Kindly Verify Your Account',
    };
  }

  async loginPlanner(payload: LoginPlannerInput): Promise<returnString> {
    const { email, password } = payload;
    const planner = await this.plannerService.getByEmail(email);

    if ((await comparePassword(password, planner.password)) === false) {
      throw new BadRequestException('your password is incorrect');
    }

    const jwtPayload = {
      id: planner._id,
      firstName: planner.firstName,
    };

    return {
      Response: this.jwtService.sign(jwtPayload),
    };
  }

  async getUserJwt(id: string) {
    const [user, planner, vendor] = await Promise.all([
      await this.userService.getById(id),
      await this.plannerService.getById(id),
      await this.vendorService.getById(id),
    ]);

    if (user) {
      return user;
    }
    if (planner) {
      return planner;
    }
    if (vendor) {
      return vendor;
    }
  }

  async changePassword(
    payload: ChangePasswordDto,
    currentUser: UserDocument | VendorDocument | PlannerDocument,
  ): Promise<returnString> {
    const { newPassword, oldPassword } = payload;

    try {
      if (!currentUser) {
        throw new UnauthorizedException('User not found');
      }

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
}
