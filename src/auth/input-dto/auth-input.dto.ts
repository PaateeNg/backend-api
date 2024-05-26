import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  isEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserTypeENum } from '../enum/auth.enum';

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

  @Field()
  @IsNotEmpty()
  @IsEnum(UserTypeENum)
  userType: UserTypeENum;
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

  @Field()
  @IsNotEmpty()
  @IsEnum(UserTypeENum)
  userType: UserTypeENum;
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

  @Field()
  @IsNotEmpty()
  @IsEnum(UserTypeENum)
  userType: UserTypeENum;
}

@InputType()
export class CreateAccountWithOughtDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(UserTypeENum)
  userType: UserTypeENum;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;
}

@InputType()
export class CreateInputDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(UserTypeENum)
  userType: UserTypeENum;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@InputType()
export class LoginInputDto {
  @Field()
  @IsNotEmpty()
  @IsEnum(UserTypeENum)
  loginAs: UserTypeENum;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
