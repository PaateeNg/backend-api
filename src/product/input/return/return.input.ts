import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
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
  @Field((type) => Int, { nullable: true })
  @IsOptional()
  total?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  offSet?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  limit?: number;

  @Field((type) => Int, { nullable: true })
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
