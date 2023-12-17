import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginVendorDto{
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string
}