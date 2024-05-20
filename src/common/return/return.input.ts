import { Field, ObjectType } from '@nestjs/graphql';
import { Planner } from 'src/planner/schema/planner.schema';
import { User } from 'src/user/schema/user.schema';
import { Vendor } from 'src/vendor/schema/vendor.schema';

@ObjectType()
export class returnString {
  @Field(() => String)
  Response: string;
}


