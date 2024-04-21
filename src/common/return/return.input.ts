import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class returnString {
  @Field((type) => String)
  Response: string;
}
