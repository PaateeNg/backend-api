import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserTypeENum } from 'src/auth/enum/auth.enum';

@InputType()
export class PlanerInputDto {
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
  password: string;
}

@InputType()
export class updatePlannerDto {
  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  businessName?: string;

  @Field({ nullable: true })
  @IsOptional()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  categories?: string;

  @Field({ nullable: true })
  @IsOptional()
  years_of_Experience?: string;

  @Field({ nullable: true })
  @IsOptional()
  profilePicture?: string;

  @Field({ nullable: true })
  @IsOptional()
  phoneNumber?: number;

  @Field({ nullable: true })
  @IsOptional()
  amountCharge?: number;
}

@InputType()
export class LoginPlannerInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
