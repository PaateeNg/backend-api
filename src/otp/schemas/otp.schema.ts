import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpEnumType } from '../enum/otp.enum';

export type otpDocument = Otp & Document;

@Schema()
export class Otp {
  @Field()
  @Prop({ type: String, required: true })
  email: string;

  @Field(() => OtpEnumType)
  @Prop({ type: String, enum: OtpEnumType, required: true })
  type: OtpEnumType;

  @Field()
  @Prop({ type: Number, required: true })
  code: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000),
    expires: '30m',
  })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
