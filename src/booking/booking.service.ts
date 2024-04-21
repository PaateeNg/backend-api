import { Injectable } from '@nestjs/common';
import { BookingInput } from './input/booking.input';
import { InjectModel } from '@nestjs/mongoose';
import { Booked, BookedDocument } from './schema/booking.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booked.name)
    private bookedModel: Model<BookedDocument>,
  ) {}

  async bookedVendor(payload: BookingInput, user: User): Promise<any> {}
}
