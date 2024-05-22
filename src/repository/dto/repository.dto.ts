import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

// @ArgsType()
@InputType()
export class PaginationDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  size?: number;
}
