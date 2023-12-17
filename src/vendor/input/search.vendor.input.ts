import { InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class VendorSearch{

    @IsString()
    bussineName?: string

    @IsString()
    location?: string

    @IsString()
    category?: string[];
    
    @IsString()
    years_of_Experience?: string;
  
}