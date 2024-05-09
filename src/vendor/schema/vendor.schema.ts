import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type VendorDocument = Vendor & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Vendor {
  @Field()
  @Prop()
  email: string;

  @Field()
  @Prop()
  firstName: string;

  @Field()
  @Prop()
  lastName: string;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: false })
  isVendor: boolean;

  @Field()
  @Prop()
  password: string;

  @Field()
  @Prop()
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

  @Field()
  @Prop({ type: String })
  location?: string;

  @Field()
  @Prop({ type: String })
  category?: string;

  @Field()
  @Prop({ type: String })
  years_of_Experience?: string;

  @Field()
  @Prop({ type: String })
  profilePhoto?: string;

  @Field()
  @Prop({ type: String })
  businessPhone?: string;

  @Field(() => [String])
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
