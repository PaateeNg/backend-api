import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { ProductCategory } from '../enum/product.enum';

export type ProductDocument = Product & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field()
  @Prop({ type: String, required: true })
  productName: string;

  @Field()
  @Prop({ type: String, required: true })
  makeBy: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  category: string;

  // @Prop({ type: [String], enum: ProductCategory, required: true, default: [] })

  @Field()
  @Prop({ type: Number, required: true })
  price: number;

  @Field()
  @Prop({ type: String, required: true })
  productDescription?: string;

  @Field()
  @Prop({ type: String })
  productImages?: string;

  @Field()
  @Prop({ type: Boolean, default: false })
  priceNegotiable: boolean;

  @Field({ nullable: true })
  @Prop({ type: String, default: 1 })
  quantity?: number;

  @Field()
  @Prop({ type: Boolean, default: false })
  isProductApproved: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Field({ nullable: true })
  @Prop({ default: Date.now() })
  date_added: Date;

  @Field(() => Vendor)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' })
  creatorId: mongoose.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
