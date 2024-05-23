import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Cart, CartDocument } from './schema/addtocart.schema';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CartService } from './cart.service';
import { CreateCartDto } from './input/addtocartinput';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { UserDocument } from 'src/user/schema/user.schema';
import { PlannerDocument } from 'src/planner/schema/planner.schema';

@Resolver()
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Mutation((of) => Cart)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MODERATOR, Role.PLANNER)
  async addToCart(
    @Args('payload') payload: CreateCartDto,
    @GetCurrentGqlUser() user: UserDocument | PlannerDocument,
  ): Promise<CartDocument> {
    return this.cartService.addToCart(payload, user);
  }
}
