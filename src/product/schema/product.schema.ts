import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';

export type ProductDocument = Product & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field()
  @Prop()
  productName: string;

  @Field()
  @Prop()
  makeBy: string;

  @Field()
  @Prop({ type: String, nullable: true })
  category?: string;

  @Field()
  @Prop({ type: Number, default: 0.0, required: true })
  price: number;

  @Field()
  @Prop({ type: String })
  productDescription?: string;

  @Field()
  @Prop({ type: String })
  productImage?: string;

  @Field()
  @Prop({ default: false })
  priceNegotiable: boolean;

  @Field()
  @Prop({ default: false })
  isProductApproved: boolean;

  @Prop({ default: false, type: Boolean })
  isDeleted: boolean;

  @Field(() => Vendor)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' })
  creatorId: mongoose.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
