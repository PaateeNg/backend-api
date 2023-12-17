import { IsEmail, IsNotEmpty } from "class-validator";


export class ForgetPlannerPasswordDTO{
    @IsEmail()
    @IsNotEmpty()
    email: string
}