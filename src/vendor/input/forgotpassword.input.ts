import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class ForgetVendorPasswordDTO{
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string
}