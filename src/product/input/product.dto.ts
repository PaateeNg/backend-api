import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  category: string[];

  @Field()
  @IsNumber()
  //@Transform(({ value }) => parseFloat(value.trim()))
  @IsNotEmpty()
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  priceNegotiable: boolean;
}

@InputType()
export class UpdateProductsInput extends PartialType(CreateProductInput) {}
