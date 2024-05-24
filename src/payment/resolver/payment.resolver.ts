import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Payment } from '../schemas/payment.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePaymentDto } from '../dto/payment.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { PaymentService } from '../service/payment.service';
import { PaymentResponseMessage } from '../dto/response/payment.response';
import { PlannerDocument } from 'src/planner/schema/planner.schema';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation((returns) => PaymentResponseMessage)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER, Role.PLANNER, Role.MODERATOR)
  async makePayment(
    @Args('payload') payload: CreatePaymentDto,
    @GetCurrentGqlUser() user: UserDocument | PlannerDocument,
  ): Promise<PaymentResponseMessage> {
    return await this.paymentService.makePayment(payload, user);
  }
}
