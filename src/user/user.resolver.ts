import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { User, UserDocument } from './schema/user.schema';
import { returnString } from '../common/return/return.input';
import { UpdateUserDto } from './input/user.input.dto';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => User)
  updateUser(
    @Args('payload') payload: UpdateUserDto,
    @GetCurrentGqlUser() user: UserDocument,
  ): Promise<UserDocument> {
    return this.userService.updateUser(payload, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => User)
  async userprofile(@GetCurrentGqlUser() user: User) {
    return user;
  }

  @Query((returns) => [User])
  async getAllUser(): Promise<UserDocument[]> {
    return await this.userService.getAll();
  }
}
