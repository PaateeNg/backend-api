import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PlanerInputDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  location: string;

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
  @IsEmail()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@InputType()
export class updatePlannerDto extends PartialType(PlanerInputDto) {
  @Exclude()
  password: string;
  @Exclude()
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
