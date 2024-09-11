import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { updatePlannerDto, PlanerInputDto } from './input/planner.input.dto';
import { hashed } from 'src/common/hashed/util.hash';
import { InjectModel } from '@nestjs/mongoose';
import { Planner, PlannerDocument } from './schema/planner.schema';
import { Model } from 'mongoose';
import { ENVIRONMENT } from 'src/common/constant/environment/env.variable';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountWithOughtDto } from 'src/auth/input-dto/auth-input.dto';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private plannerModel: Model<PlannerDocument>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async createPlanner(payload: PlanerInputDto) {
    const { password, email } = payload;
    try {
      const hashedPassword = await hashed(password);

      const savedPlanner = await this.plannerModel.create({
        ...payload,
        password: hashedPassword,
      });

      // await this.otpService.sendOtp({
      //   email: email,
      //   type: OtpEnumType.AccountVerification,
      // });

      return savedPlanner;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createPlannerWithGoogle(payload: CreateAccountWithOughtDto) {
    const { email } = payload;

    const accessToken = await this.jwtToken(email);
    const newUser = await this.plannerModel.create({
      email: email,
      isUser: true,
      isGoogleAuth: true,
      accessToken: accessToken.Response,
      isAccountVerified: true,
    });

    return newUser;
  }

  async getPlanerByEmailOrBusinessName(email: string, businessName: string) {
    const plannerExist = await this.plannerModel.findOne({
      email: email,
      businessName: businessName,
    });
    if (!plannerExist) {
      return;
    }

    return plannerExist;
  }

  async getByEmail(email: string): Promise<PlannerDocument> {
    const planner = await this.plannerModel.findOne({ email: email });
    if (!planner) {
      return;
    }
    return planner;
  }

  async updatePlanner(
    payload: updatePlannerDto,
    plannerId: string,
  ): Promise<PlannerDocument> {
    try {
      const { amountCharge } = payload;
      let chargeTotal = 0;
      const plannerExist = await this.getById(plannerId);

      if (!plannerExist) {
        throw new NotFoundException('Not Found');
      }

      if (plannerExist.isAccountSuspended) {
        throw new UnauthorizedException('Contact Support');
      }

      if (amountCharge) {
        const percentage = amountCharge * +ENVIRONMENT.PERCENTAGE.PlANNER;
        chargeTotal = amountCharge + percentage;
      }

      const updatedVendor = await this.plannerModel.findOneAndUpdate(
        { _id: plannerId },
        {
          ...payload,
          amountCharge: chargeTotal,
        },
        {
          new: true,
        },
      );

      return updatedVendor;
    } catch (error) {
      if (error instanceof NotFoundException || UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async getAllPlanner(): Promise<PlannerDocument[]> {
    return await this.plannerModel.find({
      isAccountSuspended: false,
      isAccountVerified: true,
      isPlannerApproved: true,
    });
  }

  async getById(id: string): Promise<PlannerDocument> {
    const planner = await this.plannerModel.findOne({
      _id: id,
    });

    if (!planner) {
      return;
    }

    return planner;
  }

  async jwtToken(payload: any) {
    const jwtPayload = {
      id: payload._id,
    };

    return {
      Response: this.jwtService.sign(jwtPayload),
    };
  }

  async deletePlannerByEmail(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Vendor Not found or has already deleted');
    }
    await this.plannerModel.findOneAndDelete({ email: email }, { new: true });
    return {
      Response: 'Planner deleted successfully',
    };
  }
}
