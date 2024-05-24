import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../schemas/payment.schema';
import { PaymentResolver } from '../resolver/payment.resolver';
import { CartModule } from 'src/cart/cart.module';
import { BookingModule } from 'src/booking/booking.module';
import { PaymentService } from '../service/payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    CartModule,
    BookingModule,
  ],
  providers: [PaymentResolver, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
