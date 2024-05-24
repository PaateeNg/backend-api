import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class CardDetail {
  @Field()
  @Prop({ type: String })
  nameOnCard: string;

  @Field()
  @Prop({ type: String })
  number: string;
}
