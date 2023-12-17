import { IsEmail, IsNotEmpty } from "class-validator";


export class ForgetVendorPasswordDTO{
    @IsEmail()
    @IsNotEmpty()
    email: string
}