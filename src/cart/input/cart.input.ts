import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ProductQuantityInput } from './addtocartinput';

@InputType()
export class AddToCartInput {
  @Field(() => [ProductQuantityInput])
  @IsNotEmpty()
  items: ProductQuantityInput[];
}
