import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventTypeEnum } from '../enum/booking.enum';

@InputType()
export class BookingInputDto {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  phoneNumber: number;

  @Field()
  @IsNotEmpty()
  @IsDate()
  eventDate: Date;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  @IsEnum(EventTypeEnum, { each: true })
  eventType: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  eventLocation: string;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  plannerIds: string[];
}
