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

  // @Field(() => [String])
  // @Prop({ type: [String], default: [] })
  // items: string[];

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  priceTotal: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Planner' })
  plannerId?: mongoose.Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
