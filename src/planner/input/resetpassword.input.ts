import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ResetPlannerPasswordDTO{

    @Field()
    email: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    token: string;
  
    @Field()
    @IsNotEmpty()
    @IsString()
    newPassword: string;
    
    @Field()
    @IsNotEmpty()
    @IsString()
    confirmedNewPassword: string
}