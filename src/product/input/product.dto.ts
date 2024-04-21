import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  makeBy: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productDescription: string;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  priceNegotiable: boolean;
}

@InputType()
export class UpdateProductsInput extends PartialType(CreateProductInput) {}
