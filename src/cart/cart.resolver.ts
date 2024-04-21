import { Resolver } from '@nestjs/graphql';
import { AddToCart } from './schema/addtocart.schema';

@Resolver()
export class CartResolver {
  // constructor(private cartService: CartService){}
  // @Mutation(of => returnString)
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.USER, Role.MODERATOR)
  // async addtoCart(@Args('addtocart') addtocartInput: AddToCartInput, @GetCurrentGqlUser() user: User ):Promise<returnString>{
  //    return this.cartService.addToCart(addtocartInput, user)
  // }
}
