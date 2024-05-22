import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BookingInputDto } from './input/booking.input';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { BookingService } from './booking.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { Booked, BookedDocument } from './schema/booking.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Resolver((of) => Booked)
export class BookingResolver {
  constructor(private bookedService: BookingService) {}

  @Mutation((of) => Booked)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MODERATOR)
  async createBooking(
    @Args('payload') payload: BookingInputDto,
    @GetCurrentGqlUser() user: UserDocument,
  ): Promise<BookedDocument> {
    return this.bookedService.bookAPlanner(payload, user);
  }
}
