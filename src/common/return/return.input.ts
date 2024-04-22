import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class returnString {
  @Field(() => String)
  Response: string;
}
