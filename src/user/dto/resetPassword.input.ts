import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO{

    
    email: string;
  
    token: string;
  
    
    newPassword: string;
    
    confirmedNewPassword: string
}