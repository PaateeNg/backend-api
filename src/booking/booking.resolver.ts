import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BookingInput } from './input/booking.input';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { BookingService } from './booking.service';
import { User } from 'src/user/schema/user.schema';
import { Booked } from './schema/booking.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { returnString } from 'src/common/return/return.input';

@Resolver()
export class BookingResolver {
    constructor(private bookedService: BookingService){}

    @Mutation(of=> returnString)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER, Role.MODERATOR)
    async createBooking( @Args('bookingid') bookinginput: BookingInput, @GetCurrentGqlUser() user: User):Promise<returnString>{

       const { vendorid, productid} = bookinginput;

         return this.bookedService.bookedVendor( bookinginput, user, vendorid, productid)
    }
}
