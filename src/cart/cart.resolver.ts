import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { AddToCartInput } from './input/cart.input';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { User } from 'src/user/schema/user.schema';
import { AddToCart } from './schema/addtocart.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { returnString } from 'src/common/return/return.input';

@Resolver()
export class CartResolver {

constructor(private cartService: CartService){}

@Mutation(of => returnString)

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER, Role.MODERATOR)
async addtoCart(@Args('addtocart') addtocartInput: AddToCartInput, @GetCurrentGqlUser() user: User ):Promise<returnString>{
   return this.cartService.addToCart(addtocartInput, user)

}

}
