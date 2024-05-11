import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, otpDocument } from '../schemas/otp.schema';
import { CreateOtpDto, SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { OtpEnumType } from '../enum/otp.enum';
import { ConstantMessage } from 'src/common/constant/message/message.constant';
import { EmailService } from 'src/mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<otpDocument>,
    private mailerService: EmailService,
  ) {}

  async createOtp(payload: CreateOtpDto) {
    const { email } = payload;

    const otp = await this.otpModel.findOne({ email: email });

    if (otp) {
      await this.otpModel.findOneAndUpdate({ email: email }, payload, {
        new: true,
      });
    }

    return await this.otpModel.create({ ...payload });
  }

  async sendOtp(payload: SendOtpDto) {
    const { email, type } = payload;

    const code = 2345;

    let template: any;
    let subject: any;

    if (type === OtpEnumType.AccountVerification) {
      template = await ConstantMessage.AccountVerificationTemplate(code);
      subject = ConstantMessage.subject;
    }
    if (type === OtpEnumType.ResetPassword) {
      template = await ConstantMessage.ResetPasswordTemplate(code);
      subject = ConstantMessage.subject;
    }

    const otp = await this.createOtp({
      email,
      type,
      code,
    });

    if (!otp) {
      throw new InternalServerErrorException('Error while Generating Otp');
    }

    await this.mailerService.sendMessage(email, subject, template);
    return true;
  }

  async verifyOtp(payload: VerifyOtpDto) {
    try {
      const { email, code } = payload;
      const otp = await this.otpModel.findOne({ email: email, code: code });
      if (!otp) {
        throw new BadRequestException('Otp is either invalid or has expired');
      }

      await this.deleteOtp(otp._id);

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async deleteOtp(id: string) {
    return await this.otpModel.findOneAndDelete({ _id: id }, { new: true });
  }
}
