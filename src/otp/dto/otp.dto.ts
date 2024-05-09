import { Field, InputType } from '@nestjs/graphql';
import { OtpEnumType } from '../enum/otp.enum';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateOtpDto {
  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  type: OtpEnumType;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  code: number;
}

@InputType()
export class SendOtpDto {
  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  type: OtpEnumType;
}

@InputType()
export class VerifyOtpDto extends CreateOtpDto {}
