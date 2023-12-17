import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class verifyEmailDto{
    @Field()
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @Field()
    @IsNotEmpty()
    @IsString()
    confirmedToken: string;
}