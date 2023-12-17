import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { BookingController } from './booking.controller';
import { addToCartMongooseFeature, bookedMongooseFeature, plannerMongooseFeature, productMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    bookedMongooseFeature,
    productMongooseFeature,
    vendorMongooseFeature,

  ],
  providers: [BookingService, BookingResolver],
  controllers: [BookingController]
})
export class BookingModule {}
