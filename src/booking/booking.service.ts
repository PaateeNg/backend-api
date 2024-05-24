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

    let priceCart: { price: number }[] = [];
    let totalPrice = 0;

    const plannerResults = await Promise.all(
      plannerIds.map(async (id) => {
        const planner = await this.plannerService.getById(id);

        if (!planner) {
          throw new NotFoundException(`Planner with ID ${id} not found`);
        }

        priceCart.push({
          price: planner.amountCharge,
        });

        return planner;
      }),
    );

    priceCart.forEach((planner) => {
      totalPrice += planner.price;
    });

    const booked = await this.bookedModel.create({
      ...payload,
      userId: user._id,
      totalBookingAmount: totalPrice,
      bookedPlanner: plannerResults,
    });

    user.bookedMenu.push(...plannerIds);

    await user.save();

    return booked;
  }

  async getById(bookedId: string, userId: string) {
    const booked = await this.bookedModel.findOne({
      _id: bookedId,
      userId: userId,
    });
    if (!booked) {
      throw new NotFoundException(`Booking with ID ${bookedId} not found`);
    }
    return booked;
  }
}
