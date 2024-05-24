import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Item } from './sub-cart.schema';

export type CartDocument = Cart & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Cart {
  @Field(() => [Item])
  @Prop({ type: [Item], default: [] })
  items: Item[];

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  priceTotal: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' || 'Planner' })
  creatorId?: mongoose.Types.ObjectId;

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

export const CartSchema = SchemaFactory.createForClass(Cart);
