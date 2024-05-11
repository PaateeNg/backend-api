import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PlanerInputDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@InputType()
export class updatePlannerDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
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
