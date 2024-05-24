import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class PaymentResponseMessage {
  @Field({ nullable: true })
  @IsOptional()
  paymentProviderRedirectUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  paymentReference?: string;

  @Field({ nullable: true })
  @IsOptional()
  accessCode?: string;
}
