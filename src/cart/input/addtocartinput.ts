import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class AddToCartDate {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

@InputType()
export class CreateCartDto {
  @Field(() => [AddToCartDate])
  @IsArray()
  @IsNotEmpty()
  @Type(() => AddToCartDate)
  items: AddToCartDate[];
}
