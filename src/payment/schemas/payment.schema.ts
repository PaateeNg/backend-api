import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CardDetail } from './sub-payment.schema';
import { Cart } from 'src/cart/schema/addtocart.schema';
import { Booked } from 'src/booking/schema/booking.schema';

export type PaymentDocument = Payment & Document;

@ObjectType()
@Schema()
export class Payment {
  @Field()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => Cart)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cartId?: mongoose.Types.ObjectId;

  @Field(() => Booked)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Booked' })
  bookedId?: mongoose.Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ type: String })
  transactionReference?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  transactionStatus?: string;

  @Field({ nullable: true })
  @Prop({ type: Number })
  amount?: number;

  @Field({ nullable: true })
  @Prop({ type: String })
  currency: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  paymentType?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  channel: [string];

  @Field({ nullable: true })
  @Prop({ type: String })
  gateway_response?: string;

  @Field({ nullable: true })
  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Field({ nullable: true })
  @Prop({ type: Date })
  paid_at?: Date;

  @Field(() => CardDetail, { nullable: true })
  @Prop({ type: CardDetail })
  cardDetails?: CardDetail;

  @Field({ nullable: true })
  @Prop({ type: Date })
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
