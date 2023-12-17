import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, Min } from "class-validator";

@InputType()
export class ProductQuantityInput {
    @Field()
    @IsNotEmpty()
    productid: string;
  
    @Field()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
  }