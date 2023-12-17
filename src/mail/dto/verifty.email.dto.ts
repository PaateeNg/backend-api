import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class verifyEmailDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    confirmedToken: string;
}