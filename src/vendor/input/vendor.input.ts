import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserTypeENum } from 'src/auth/enum/auth.enum';

@InputType()
export class VendorInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  state: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  city: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  business_phone: string;



  @Field()
  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword()
  password: string;
}

@InputType()
export class UpdateVendorDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  businessName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  years_of_Experience?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  phoneNumber?: number;
}

@InputType()
export class LoginVendorInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
