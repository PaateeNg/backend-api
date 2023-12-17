import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChangeVendorPasswordDTO{
    @Field()
    password: string;

    @Field()
    confirmedPassword: string
}