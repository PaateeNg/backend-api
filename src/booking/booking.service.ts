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
      plannerIds.map((id) => {
        const planner = this.plannerService.getById(id);

        if (!planner) {
          throw new NotFoundException(`Planner with ID ${id} not found`);
        }

        return planner;
      }),
    );

    const booked = await this.bookedModel.create({
      ...payload,
      userId: user._id,
      bookedPlanner: plannerResults,
    });

    user.bookedMenu.push(...plannerIds);

    await user.save();

    return booked;
  }
}
