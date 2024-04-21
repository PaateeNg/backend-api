import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type PlannerDocument = Planner & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Planner {
  @Field()
  @Prop({ type: String, unique: true })
  email: string;

  @Field()
  @Prop()
  firstName: string;

  @Field()
  @Prop()
  lastName: string;

  @Field()
  @Prop()
  password: string;

  @Field()
  @Prop()
  businessName: string;

  @Field()
  @Prop({ default: false })
  isPlannerApproved: boolean;

  @Field()
  @Prop()
  location: string;

  @Field(() => [String])
  @Prop({ type: [String], enum: Role, default: Role.PLANNER })
  plannerRole: Role[];

  @Field()
  @Prop({ type: String })
  categories?: string;

  @Field()
  @Prop({ type: String })
  years_of_Experience?: string;

  @Field()
  @Prop({ type: String, nullable: true })
  profilePicture?: string;

  @Field()
  @Prop({ type: Number })
  phoneNumber: number;

  @Prop({ default: false, type: Boolean })
  isAccountVerified: boolean;

  @Prop({ default: false })
  isAccountSuspended: boolean;
}

export const PlannerSchema = SchemaFactory.createForClass(Planner);
