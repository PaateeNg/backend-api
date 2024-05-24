import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PlanerInputDto, updatePlannerDto } from './input/planner.input.dto';
import { hashed } from 'src/common/hashed/util.hash';
import { InjectModel } from '@nestjs/mongoose';
import { Planner, PlannerDocument } from './schema/planner.schema';
import { Model } from 'mongoose';
import { ENVIRONMENT } from 'src/common/constant/environment/env.variable';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private plannerModel: Model<PlannerDocument>,
    private otpService: OtpService,
  ) {}

  async createPlanner(payload: PlanerInputDto) {
    const { password, email } = payload;
    try {
      const hashedPassword = await hashed(password);

      const savedPlanner = await this.plannerModel.create({
        ...payload,
        password: hashedPassword,
        isPlanner: true,
      });

      await this.otpService.sendOtp({
        email: email,
        type: OtpEnumType.AccountVerification,
      });

      return savedPlanner;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
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
}
