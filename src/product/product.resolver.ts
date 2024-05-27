import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateProductInput,
  FindProductByNameDto,
  UpdateProductsInput,
} from './input/product.dto';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { VendorDocument } from 'src/vendor/schema/vendor.schema';
import { Product, ProductDocument } from './schema/product.schema';
import { ProductDetails, ProductsAndCount } from './input/return/return.input';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { returnString } from 'src/common/return/return.input';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Mutation((returns) => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  async create(
    @Args('payload') payload: CreateProductInput,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ): Promise<ProductDocument> {
    return this.productService.create(payload, vendor);
  }

  @Mutation((returns) => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('payload') payload: UpdateProductsInput,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ) {
    return await this.productService.update(productId, payload, vendor);
  }

  //this route will only be access by the admin or moderator//move to admin resolver
  @Query((returns) => ProductsAndCount)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  findProductsNotApproved(): Promise<ProductsAndCount> {
    return this.productService.findProductsNotApproved();
  }

  @Mutation((returns) => returnString)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  async deletedProductById(
    @Args('productId') productId: string,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ): Promise<returnString> {
    return this.productService.deletedProductById(productId, vendor._id);
  }

  @Query(() => [Product])
  async searchForProductByNAme(
    @Args() name?: FindProductByNameDto,
  ): Promise<ProductDocument[]> {
    return this.productService.findProductByName(name);
  }

  @Query((returns) => ProductDetails)
  async getAllProduct(
    @Args('payload') name?: PaginationDto,
  ): Promise<ProductDetails> {
    return this.productService.getProductTimeLime(name);
  }
}
