import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class ForgetUserPasswordDTO{
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string
}