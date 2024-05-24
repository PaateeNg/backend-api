import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EventTypeEnum } from '../enum/booking.enum';

export type BookedDocument = Booked & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Booked {
  @Field({ nullable: true })
  @Prop({ type: String })
  email?: string;

  @Field({ nullable: true })
  @Prop({ type: Number })
  phoneNumber: number;

  @Field()
  @Prop({ type: Date, required: true })
  eventDate: Date;

  @Field(() => [String])
  @Prop({ type: [String], enum: EventTypeEnum, required: true, default: [] })
  eventType: EventTypeEnum[];

  @Field()
  @Prop({ type: String, required: true })
  eventLocation: string;

  @Field((type) => Number)
  @Prop({ type: Number, required: true })
  totalBookingAmount: number;

  @Field((type) => [String])
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Planner' })
  bookedPlanner: mongoose.Types.ObjectId[];

  @Field((type) => String)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Field((type) => Boolean)
  @Prop({ type: Boolean, default: false })
  paymentMade?: boolean;

  @Field((type) => String)
  @Prop({ type: String })
  paymentReferenceId?: string;

  @Field((type) => String)
  @Prop({ type: String })
  paymentStatus?: string;
}

export const BookedSchema = SchemaFactory.createForClass(Booked);
