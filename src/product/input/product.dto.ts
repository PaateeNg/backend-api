import { ArgsType, Field, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductCategory } from '../enum/product.enum';
import { Transform, Type } from 'class-transformer';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productName: string;

  // @Field()
  // @IsNotEmpty()
  // @IsString()
  // makeBy: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productDescription: string;

  @Field(() => String)
  @IsNotEmpty()
  //@IsArray()
  //@IsEnum(ProductCategory, { each: true })
  category: string;

  @Field()
  @IsNumber({})
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @Field()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  priceNegotiable: boolean;
}

@InputType()
export class UpdateProductsInput extends PartialType(CreateProductInput) {}

@ArgsType()
export class FindProductByNameDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  keyword?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page?: number;
}
