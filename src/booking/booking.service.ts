import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingInputDto } from './input/booking.input';
import { InjectModel } from '@nestjs/mongoose';
import { Booked, BookedDocument } from './schema/booking.schema';
import { Model } from 'mongoose';
import { PlannerService } from 'src/planner/planner.service';
import { UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booked.name)
    private bookedModel: Model<BookedDocument>,
    private plannerService: PlannerService,
  ) {}

  async bookAPlanner(
    payload: BookingInputDto,
    user: UserDocument,
  ): Promise<BookedDocument> {
    const { plannerIds } = payload;

    const plannerResults = await Promise.all(
      plannerIds.map(async (id) => {
        return await this.plannerService.getById(id);
      }),
    );

    if (!plannerResults) {
      throw new NotFoundException('Planner Not Found');
    }

    const booked = await this.bookedModel.create({
      ...payload,
      userId: user._id,
      bookedPlanner: plannerResults,
    });

    plannerResults.map(async (planner) => {
      user.yourBookedMenu.push(planner._id);
      await user.save();
    });

    return booked;
  }
}
