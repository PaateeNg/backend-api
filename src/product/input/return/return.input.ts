import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Product, ProductDocument } from 'src/product/schema/product.schema';

@ObjectType()
export class ProductsAndCount {
  @Field((type) => [Product])
  products: ProductDocument[];

  @Field((type) => Int)
  totalProductCount: number;
}

@InputType()
export class ProductQueryInput {
  @Field({ nullable: true })
  keyword?: string;

  @Field({ nullable: true })
  page?: number;
}
