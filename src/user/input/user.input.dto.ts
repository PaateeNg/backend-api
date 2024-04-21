import { Field, InputType, PartialType } from '@nestjs/graphql';
//import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  phoneNumber: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@InputType()
export class UpdateUserDto extends PartialType(CreateUserInput) {
  @Exclude()
  email: string;

  @Exclude()
  password: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
