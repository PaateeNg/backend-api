import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Product, ProductDocument } from 'src/product/schema/product.schema';

@ObjectType()
export class ProductsAndCount {
  @Field((type) => [Product])
  products: ProductDocument[];

  @Field((type) => Int)
  totalProductCount: number;
}

@ObjectType()
class Meta {
  @Field({ nullable: true })
  @IsOptional()
  total?: number;

  @Field({ nullable: true })
  @IsOptional()
  page?: number;

  @Field({ nullable: true })
  @IsOptional()
  size?: number;

  @Field({ nullable: true })
  @IsOptional()
  lastPage?: number;
}

@ObjectType()
export class ProductDetails {
  @Field((type) => [Product])
  data: ProductDocument[];

  @Field((type) => Meta)
  metadata: Meta;
}
