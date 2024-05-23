import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@ObjectType()
@Schema()
export class Item {
  @Field(() => String, { nullable: true })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId?: mongoose.Types.ObjectId;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  quantity?: number;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  price?: number;
}
