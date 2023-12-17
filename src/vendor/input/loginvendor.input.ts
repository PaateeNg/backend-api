import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class LoginVendorInput{
    @Field()
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string
}