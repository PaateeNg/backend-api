import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlannerService } from './planner.service';
import { Planner, PlannerDocument } from './schema/planner.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
import { returnString } from 'src/common/return/return.input';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { updatePlannerDto } from './input/planner.input.dto';

@Resolver((of) => Planner)
export class PlannerResolver {
  constructor(private plannerService: PlannerService) {}

  @Query((returns) => Planner)
  @UseGuards(GqlAuthGuard)
  async plannerProfile(@GetCurrentGqlUser() planner: Planner) {
    return planner;
  }

  @Mutation((returns) => returnString)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PLANNER, Role.MODERATOR)
  updatePlanner(
    @Args('updatePayload') payload: updatePlannerDto,
    @GetCurrentGqlUser() planner: PlannerDocument,
  ): Promise<returnString> {
    return this.plannerService.updatePlanner(payload, planner);
  }

  @Query((returns) => [Planner])
  getAll() {
    return this.plannerService.getAllPlanner();
  }
}
