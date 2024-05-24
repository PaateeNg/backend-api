import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreatePaymentDto {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsMongoId()
  cartId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsMongoId()
  bookedId?: string;
}
