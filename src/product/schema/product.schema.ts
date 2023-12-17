import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';

@ObjectType()
@Schema({timestamps: true})
export class Product extends Document {

  @Field(()=>String)
  _id?: mongoose.Types.ObjectId;

  @Field()
  @Prop()
  productName: string;

  @Field()
  @Prop()
  makeBy: string;

  @Field()
  @Prop({default: 'wedding'})
  category: string;

  @Field()
  @Prop({ type: 'Number', default: 0.0 })
  price: number;

  @Field()
  @Prop({default: null })
  productDescription: string;

  @Field()
  @Prop({default: null})
  productImage: string;

  @Field()
  @Prop({default: false})
  priceNegotiable: boolean;

  @Field()
  @Prop({default: false})
  approved: boolean;


  @Prop({default: false})
  deleted: boolean;

//relationship between product and vendor posting the product
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userid: mongoose.Types.ObjectId;

  @Field(()=>Vendor)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor'})
  vendorid: mongoose.Types.ObjectId;


  
}

export const ProductSchema = SchemaFactory.createForClass(Product)