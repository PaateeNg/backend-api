import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './input/createProducts.input';
import { ProductService } from './product.service';
import { UpdateProductsInput } from './input/updateProduct.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { Product } from './schema/product.schema';
import { ProductsAndCount } from './input/return/return.input';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { returnString } from 'src/common/return/return.input';

@Resolver(of => Product)
export class ProductResolver {
    constructor(private productService: ProductService){}

    @Mutation(returns => returnString)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.VENDOR)
    async createProducts(@Args('productInput') createProduct: CreateProductInput, @GetCurrentGqlUser()vendor: Vendor):Promise<returnString>{
        return this.productService.createProducts(createProduct, vendor)
    }

    @Mutation(returns => Product)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.VENDOR)
    async updateProduct(@Args('id') id: string, @Args('updateproduct') updateproduct: UpdateProductsInput ){
        return await this.productService.updateproduct(id, updateproduct)
    }

    @Query(returns=> ProductsAndCount)
    findProducts():Promise<ProductsAndCount>{
        return this.productService.findProducts()
    }

    //this route will only be access by the admin or moderator
    @Query(returns=> ProductsAndCount)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    findProductsNotApproved():Promise<ProductsAndCount>{
        return this.productService.findProductsNotApproved()
    }

    //this route will only be access by the admin or moderator
    @Query(returns=> returnString)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    deletedProdutById(@Args('id') id: string):Promise<returnString>{
        return this.productService.deletedProductById(id)
    }

    //this is function to approve a product posting or uploaded by a vendor
    //the enspoint can only be access by admin and moderator

    @Mutation(returns => returnString)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    async approveProductById(@Args('id') id: string ){
        return await this.productService.approveProductById(id)
    }
    @Query(returns=> Product)
    findAProduct(@Args('id') id: string){
            return this.productService.findOneProduct(id)
    }

}
