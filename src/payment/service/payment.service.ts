import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/schema/user.schema';
import { initializeTransaction } from '../utils/paystack/paystack.payment';
import { CartService } from 'src/cart/cart.service';
import { BookingService } from 'src/booking/booking.service';
import { ENVIRONMENT } from 'src/common/constant/environment/env.variable';
import { PaymentResponseMessage } from '../dto/response/payment.response';
import { PlannerDocument } from 'src/planner/schema/planner.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly cartService: CartService,
    private readonly bookedService: BookingService,
  ) {}
  async makePayment(
    payload: CreatePaymentDto,
    user: UserDocument | PlannerDocument,
  ): Promise<PaymentResponseMessage> {
    const { amount, cartId, bookedId } = payload;

    if (!cartId && !bookedId) {
      throw new BadRequestException(
        `One of ${cartId} or ${bookedId} must be provided`,
      );
    }

    const initializePayment = await initializeTransaction({
      amount,
      payingUser: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    const { paymentProviderRedirectUrl, paymentReference, accessCode } =
      initializePayment;

    if (cartId) {
      const cart = await this.cartService.getById(cartId, user._id);

      cart.paymentReferenceId = paymentReference;
      cart.paymentStatus = ENVIRONMENT.PAYMENT_STATUS.NOT_PAID;
      await cart.save();
    } else if (bookedId) {
      const booked = await this.bookedService.getById(bookedId, user._id);

      booked.paymentReferenceId = initializePayment.paymentReference;
      booked.paymentStatus = ENVIRONMENT.PAYMENT_STATUS.NOT_PAID;
      await booked.save();
    }

    await this.paymentModel.create({
      userId: user._id,
      amount: amount,
      cartId: cartId,
      bookedId: bookedId,
      transactionReference: initializePayment.paymentReference,
    });

    return {
      paymentProviderRedirectUrl,
      paymentReference,
      accessCode,
    };
  }
}
