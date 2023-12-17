import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class BookingInput{

    @Field({nullable:true})
    @IsEmail()
    email?: string;

    @Field()
    @IsNotEmpty()
    phoneNumber: string;

    @Field()
    @IsNotEmpty()
    eventDate: string;

    @Field()
    @IsNotEmpty()
    eventType: string;//this should be an enum

    @Field()
    @IsNotEmpty()
    eventLocation: string;

    @Field(() => [String])
    @IsNotEmpty()
    vendorid: string[];

    @Field(() => [String], {nullable: true})
    @IsOptional()
    productid?: [string]
}