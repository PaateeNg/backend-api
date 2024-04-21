import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VendorInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword()
  password: string;
}

@InputType()
export class UpdateVendorDto extends PartialType(VendorInput) {
  @Exclude()
  email: string;

  @Exclude()
  password: string;
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
