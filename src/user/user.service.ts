import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput, UpdateUserDto } from './input/user.input.dto';
import { hashed } from 'src/common/hashed/util.hash';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { returnString } from 'src/common/return/return.input';
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
      console.log('Error', error);
      throw new InternalServerErrorException('Server Error');
    }
  }

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find({
      isDeleted: false,
      isAccountSuspended: false,
    });
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async getByIdForGUse(id: string) {
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
    user: UserDocument,
  ): Promise<returnString> {
    const userExist = await this.getById(user._id);

    if (userExist._id.toString() !== user._id.toString()) {
      throw new UnauthorizedException('Not Authorized');
    }

    if (userExist.isAccountSuspended) {
      throw new UnauthorizedException('Support Support');
    }

    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { ...payload },
      {
        new: true,
      },
    );
    return { Response: 'Updated Successfully' };
  }
}
