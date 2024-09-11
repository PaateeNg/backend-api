import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserInput, UpdateUserDto } from './input/user.input.dto';
import { hashed } from 'src/common/hashed/util.hash';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';
import { JwtService } from '@nestjs/jwt';
import {
  CreateInputDto,
  CreateAccountWithOughtDto,
} from 'src/auth/input-dto/auth-input.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: CreateUserInput) {
    const { password, email } = payload;
    try {
      const hashedPassword = await hashed(password);

      const newUser = await this.userModel.create({
        ...payload,
        password: hashedPassword,
      });

      // await this.otpService.sendOtp({
      //   email: email,
      //   type: OtpEnumType.AccountVerification,
      // });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createUserWithGoogle(payload: CreateAccountWithOughtDto) {
    const { email } = payload;

    const accessToken = await this.jwtToken(email);
    const newUser = await this.userModel.create({
      email: email,
      isUser: true,
      isGoogleAuth: true,
      accessToken: accessToken.Response,
      isAccountVerified: true,
    });

    return newUser;
  }

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find({
      isDeleted: false,
      isAccountSuspended: false,
      isAccountVerified: true,
    });
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user) {
      return;
    }
    return user;
  }

  async getByEmailOrPhoneNumber(email: string, phoneNumber: number) {
    const userExist = await this.userModel.findOne({
      email: email,
      phoneNumber: phoneNumber,
    });

    if (!userExist) {
      return;
    }

    return userExist;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      return;
    }

    return user;
  }

  async updateUser(
    payload: UpdateUserDto,
    userId: string,
  ): Promise<UserDocument> {
    const userExist = await this.getById(userId);
    if (!userExist) {
      throw new Error('User Not Found');
    }

    try {
      if (userExist._id.toString() !== userId.toString()) {
        throw new Error('Not Authorized');
      }

      if (userExist.isAccountSuspended) {
        throw new Error('Support Support');
      }

      const updatedProfile = await this.userModel.findOneAndUpdate(
        { _id: userId },
        payload,
        {
          new: true,
        },
      );
      return updatedProfile;
    } catch (error) {
      if (error instanceof Error) {
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
  async deleteUserByEmail(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('user Not found or has already deleted');
    }
    await this.userModel.findOneAndDelete({ email: email }, { new: true });
    return {
      Response: 'customer deleted successfully',
    };
  }
}
