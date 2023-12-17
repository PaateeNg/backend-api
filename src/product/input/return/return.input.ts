import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/schema/product.schema";

@ObjectType()
export class ProductsAndCount {
    @Field(type => [Product])
    products: Product[];

    @Field(type => Int)
    totalProductcount: number;
}
