import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlannerService } from './planner.service';
import { Planner, PlannerDocument } from './schema/planner.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql.guard';
import { GetCurrentGqlUser } from 'src/auth/decorators/graphQl.decorator';
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

  @Mutation((returns) => Planner)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PLANNER, Role.MODERATOR)
  async updatePlanner(
    @Args('payload') payload: updatePlannerDto,
    @GetCurrentGqlUser() planner: PlannerDocument,
  ): Promise<PlannerDocument> {
    return await this.plannerService.updatePlanner(payload, planner._id);
  }

  //change it later
  @Query((returns) => [Planner])
  async getAllPlanner(): Promise<PlannerDocument[]> {
    return await this.plannerService.getAllPlanner();
  }
}
