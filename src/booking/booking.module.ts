import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Booked, BookedSchema } from './schema/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booked.name, schema: BookedSchema }]),
  ],
  providers: [BookingService, BookingResolver],
  controllers: [],
})
export class BookingModule {}
