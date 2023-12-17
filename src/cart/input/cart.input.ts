// import { Field, InputType } from "@nestjs/graphql";
// import { IsNotEmpty } from "class-validator";

// @InputType()
// export class AddToCartInput{

//     @Field(()=> [String])
//     @IsNotEmpty()
//     productid: [string];

//     @Field({nullable: true})
//     quantity: number;

// }


import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty} from 'class-validator';
import { ProductQuantityInput } from './addtocartinput';

@InputType()
@InputType()
export class AddToCartInput {
  @Field(() => [ProductQuantityInput])
  @IsNotEmpty()
  items: ProductQuantityInput[];
}
