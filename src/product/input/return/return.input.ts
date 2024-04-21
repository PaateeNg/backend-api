import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product, ProductDocument } from 'src/product/schema/product.schema';

@ObjectType()
export class ProductsAndCount {
  @Field((type) => [Product])
  products: ProductDocument[];

  @Field((type) => Int)
  totalProductCount: number;
}
