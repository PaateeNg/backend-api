import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

@InputType()
export class ForgetPasswordDTO {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@InputType()
export class ResetPasswordDTO {
  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

@InputType()
export class VerifyAccountDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
