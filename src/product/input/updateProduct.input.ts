import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateProductsInput{


    @Field({nullable: true})
    productName: string;

    @Field({nullable: true})
    productDescription: string;

    @Field({nullable: true})
    productImage: string;

    @Field({nullable: true})
    priceAmount: number;

    @Field({nullable: true})
    category: string;

     @Field({nullable: true})
     priceNegotiable: string;

     @Field({nullable: true})
     makeBy: string;

}

