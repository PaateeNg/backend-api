import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class LoginPlannerInput{
    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @Field()
    @IsString()
    @IsNotEmpty()
    password: string
}