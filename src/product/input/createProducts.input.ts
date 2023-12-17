import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateProductInput{

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
    productDescription: string;

    @Field()
   // @IsNotEmpty()
    @IsString()
    productImage: string

    @Field()
    @IsString()
    category: string;

    @Field()
    @IsString()
    price: number;
    
    @Field()
    @IsNotEmpty()
    @IsString()
    priceNegotiable: boolean;

}