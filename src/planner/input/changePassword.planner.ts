import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChangePlannerPasswordDTO{
    @Field()
    password: string;
    
    @Field()
    confirmedPassword: string
}