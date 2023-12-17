import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ChangePasswordDTO{

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    confirmedPassword: string

    @Field()
    @IsString()
    @IsNotEmpty()
    confirmedOldPassword: string

}