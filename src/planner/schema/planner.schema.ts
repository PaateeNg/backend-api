import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type PlannerDocument = Planner & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Planner {
  @Field()
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  firstName?: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: true, default: 'IsPlanner' })
  userType: string;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: true })
  isPlanner: boolean;

  @Field({ nullable: true })
  @Prop({ type: String })
  lastName?: string;

  @Field()
  @Prop({ type: String })
  state: string;

  @Field()
  @Prop({ type: String })
  business_phone: string;

  @Field()
  @Prop({ type: String })
  city: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  password: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  accessToken?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  businessName?: string;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: false })
  isGoogleAuth: boolean;

  @Field()
  @Prop({ default: false })
  isPlannerApproved: boolean;

  @Field({ nullable: true })
  @Prop({ type: String })
  location?: string;

  @Field(() => [String])
  @Prop({ type: [String], enum: Role, default: Role.PLANNER, required: true })
  role: Role[];

  @Field({ nullable: true })
  @Prop({ type: String })
  categories?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  years_of_Experience?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  profilePicture?: string;

  @Field({ nullable: true })
  @Prop({ type: Number })
  phoneNumber?: number;

  @Field({ nullable: true })
  @Prop({ type: Number, default: 0 })
  amountCharge?: number;

  @Prop({ default: false, type: Boolean })
  isAccountVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isAccountSuspended: boolean;
}

export const PlannerSchema = SchemaFactory.createForClass(Planner);
