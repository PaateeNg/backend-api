import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type otpDocument = Otp & Document;

@Schema({ expires: 300 })
export class Otp {
  @Field()
  @Prop({ type: String, required: true })
  email: string;

  @Field()
  @Prop({ type: String, required: true })
  type: string;

  @Field()
  @Prop({ type: Number, required: true })
  code: number;

  @Field()
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Field()
  @Prop({ type: Date, default: Date.now(), expires: 300 })
  expires: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
