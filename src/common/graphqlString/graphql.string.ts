import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AccessTokenResponse {
  @Field(() => String)
  accessToken: string;
}