import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput, UpdateProductsInput } from './input/product.dto';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { VendorDocument } from 'src/vendor/schema/vendor.schema';
import { Product, ProductDocument } from './schema/product.schema';
import { ProductsAndCount } from './input/return/return.input';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { returnString } from 'src/common/return/return.input';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Mutation((returns) => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  async create(
    @Args('productInput') payload: CreateProductInput,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ): Promise<ProductDocument> {
    return this.productService.create(payload, vendor);
  }

  @Mutation((returns) => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  async update(
    @Args('productId') productId: string,
    @Args('updatePayload') payload: UpdateProductsInput,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ) {
    return await this.productService.update(productId, payload, vendor);
  }

  @Query((returns) => Product)
  async getAll(): Promise<ProductDocument[]> {
    return await this.productService.getAll();
  }

  //this route will only be access by the admin or moderator//move to admin resolver
  @Query((returns) => ProductsAndCount)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  findProductsNotApproved(): Promise<ProductsAndCount> {
    return this.productService.findProductsNotApproved();
  }

  @Query((returns) => returnString)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  deletedProductById(
    @Args('productId') productId: string,
    @GetCurrentGqlUser() vendor: VendorDocument,
  ): Promise<returnString> {
    return this.productService.deletedProductById(productId, vendor);
  }

  //this is function to approve a product posting or uploaded by a vendor
  //the enspoint can only be access by admin and moderator

  //   @Mutation((returns) => returnString)
  //   @UseGuards(GqlAuthGuard, RolesGuard)
  //   @Roles(Role.ADMIN, Role.MODERATOR)
  //   async approveProductById(@Args('id') id: string) {
  //     return await this.productService.approveProductById(id);
  //   }
}
