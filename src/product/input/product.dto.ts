import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ProductCategory } from '../enum/product.enum';
import { Transform } from 'class-transformer';

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
  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @Field()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value.trim()))
  @IsNotEmpty()
  price: number;

  @Field()
  @IsBoolean()
  priceNegotiable: boolean;
}

@InputType()
export class UpdateProductsInput extends PartialType(CreateProductInput) {}
