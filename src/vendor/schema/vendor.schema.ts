import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type VendorDocument = Vendor & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Vendor {
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
  @Prop({ type: Boolean, required: true, default: false })
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

  @Field({ nullable: true })
  @Prop({ type: String })
  category?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  years_of_Experience?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  profilePhoto?: string;

  @Field()
  @Prop({ type: Number })
  phoneNumber?: number;

  @Field(() => [String], { nullable: true })
  @Prop([
    { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] },
  ])
  productMenu?: mongoose.Types.ObjectId[];

  @Prop({ default: false, type: Boolean })
  isAccountVerified: boolean;

  @Prop({ default: false, type: Boolean })
  isAccountSuspended: boolean;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
