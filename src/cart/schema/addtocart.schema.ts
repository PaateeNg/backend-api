import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AddToCartDocument = AddToCart & Document;
@ObjectType()
@Schema({ timestamps: true })
export class AddToCart {
  @Field({ nullable: true })
  @Prop({ type: Number, default: 1 })
  quantity?: number;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  items: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;
}

export const AddToCartSchema = SchemaFactory.createForClass(AddToCart);
