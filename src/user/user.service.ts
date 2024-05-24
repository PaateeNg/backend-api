import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserInput, UpdateUserDto } from './input/user.input.dto';
import { hashed } from 'src/common/hashed/util.hash';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private otpService: OtpService,
  ) {}

  async createUser(payload: CreateUserInput) {
    const { password, email } = payload;
    try {
      const hashedPassword = await hashed(password);

      const newUser = await this.userModel.create({
        ...payload,
        password: hashedPassword,
        isUser: true,
      });

      await this.otpService.sendOtp({
        email: email,
        type: OtpEnumType.AccountVerification,
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
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
}
