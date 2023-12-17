import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class returnString {
    @Field(type => String)
    Response: string;
}



//edit and use this later
// @ObjectType()
// class ProductsAndCount {
//     @Field(type => [Product])
//     products: Product[];

//     @Field(type => Int)
//     count: number;
// }

