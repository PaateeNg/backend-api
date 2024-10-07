import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type VendorDocument = Vendor & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Vendor {
  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: mongoose.Types.ObjectId;

  @Field()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  firstName?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  lastName?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  accessToken?: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: true, default: 'vendor' })
  userType: string;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: true })
  isVendor: boolean;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: false })
  isGoogleAuth: boolean;

  @Field()
  @Prop({ type: String })
  password: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  businessName: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  business_description: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  state: string;

  @Field()
  @Prop({ type: String })
  business_phone: string;

  @Field()
  @Prop({ type: String })
  city: string;

  @Field(() => [String])
  @Prop({ type: [String], enum: Role, default: Role.VENDOR, required: true })
  role: Role[];

  @Field()
  @Prop({ default: false, type: Boolean })
  isVendorApproved: boolean;

  @Field()
  @Prop({ default: false, type: Boolean })
  isDeleted: boolean;

  @Field({ nullable: true })
  @Prop({ type: String })
  location?: string;

  @Field()
  @Prop({ type: String })
  category?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  years_of_Experience?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  x?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  instagram?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  profilePhoto?: string;

  @Field(() => [String], { nullable: true })
  @Prop([
    { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] },
  ])
  productMenu?: mongoose.Types.ObjectId[];

  @Prop({ default: false, type: Boolean })
  isAccountVerified: boolean;

  @Prop({ default: false, type: Boolean })
  isAccountSuspended: boolean;
  ///work later

  @Field(() => Date, { nullable: true })
  @Prop({})
  createdAt: Date;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
