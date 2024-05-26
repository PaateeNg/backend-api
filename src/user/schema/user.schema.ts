import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field({ nullable: true })
  @Prop({ type: String })
  firstName?: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  lastName?: string;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: false })
  isUser: boolean;

  @Field()
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  accessToken?: string;

  @Field({ nullable: true })
  @Prop({ type: Number })
  phoneNumber?: number;

  @Field({ nullable: true })
  @Prop({ type: String })
  password?: string;

  @Field({ nullable: true })
  @Prop({ type: Boolean, required: true, default: false })
  isGoogleAuth: boolean;

  @Field(() => [String])
  @Prop({ type: [String], enum: Role, default: Role.USER, required: true })
  role: Role[];

  @Field(() => [String], { nullable: true })
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Planner',
    default: [],
  })
  bookedMenu?: string[];

  @Field()
  @Prop({ type: Boolean, default: false })
  isAccountVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isAccountSuspended: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
