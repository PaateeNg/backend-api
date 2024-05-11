import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PlanerInputDto, updatePlannerDto } from './input/planner.input.dto';
import { hashed } from 'src/common/hashed/util.hash';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Planner, PlannerDocument } from './schema/planner.schema';
import { Model } from 'mongoose';
import { returnString } from 'src/common/return/return.input';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private plannerModel: Model<PlannerDocument>,
  ) {}

  async createPlanner(payload: PlanerInputDto) {
    const { password } = payload;
    try {
      const hashedPassword = await hashed(password);

      const savedPlanner = await this.plannerModel.create({
        ...payload,
        password: hashedPassword,
        isPlanner: true,
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
    planner: PlannerDocument,
  ): Promise<returnString> {
    const plannerExist = await this.getById(planner._id);

    if (plannerExist.isAccountSuspended) {
      throw new UnauthorizedException('Contact Support');
    }

    const updatedVendor = await this.plannerModel.findOneAndUpdate(
      { _id: planner._id },
      { payload },
      {
        new: true,
      },
    );

    if (!updatedVendor) {
      throw new GraphQLError('Failed to update vendor');
    }

    return {
      Response: 'updated Successfully',
    };
  }

  async getAllPlanner() {
    return await this.plannerModel.find({});
  }

  async getById(id: string): Promise<PlannerDocument> {
    const planner = await this.plannerModel.findOne({
      _id: id,
    });

    if (!planner) {
      throw new NotFoundException('planner not found');
    }

    return planner;
  }

  async getByIdForGUse(id: string) {
    const planner = await this.plannerModel.findOne({
      _id: id,
    });
    if (!planner) {
      return;
    }
    return planner;
  }
}
