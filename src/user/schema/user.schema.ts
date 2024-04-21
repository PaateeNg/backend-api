import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type UserDocument = User & Document;
@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field()
  @Prop({ type: String, required: true })
  firstName: string;

  @Field()
  @Prop({ type: String, required: true })
  lastName: string;

  @Field()
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Field()
  @Prop({ type: Number, unique: true })
  phoneNumber: number;

  @Field()
  @Prop({ type: String, required: true })
  password: string;

  @Field(() => [String])
  @Prop({ type: String, enum: Role, default: Role.USER })
  userRole: Role;

  @Field()
  @Prop({ type: Boolean, default: false })
  isAccountVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isAccountSuspended: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
