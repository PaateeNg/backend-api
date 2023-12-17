import { Field, GraphQLTimestamp, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Role } from "src/common/enum/role.enum";


@ObjectType()
@Schema({timestamps: true})
export class Planner extends Document {
  @Field(()=>String)
  _id?: mongoose.Types.ObjectId;

    @Field()
    @Prop({type: String, unique: true})
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
  @Prop({default: false})
  approved: boolean;

  @Field()
  @Prop()
  location: string;

    @Field()
    @Prop({enum: Role, default: Role.PLANNER})
    role: Role

  @Field()
  @Prop({nullable: true, default: ''})
  categories: string

  @Field()
  @Prop({ nullable: true, default: '' })
  years_of_Experience: string;

  @Field()
  @Prop({ nullable: true, default: '' })
  profilePicture: string;

  @Field()
  @Prop({ nullable: true, default: '' })
  phoneNumber: string;

  @Prop({ default: false })
  emailConfirmed: boolean;

  @Prop({nullable: true})
  emailConfirmedToken: string;
  
  @Prop({type: Date, nullable: true })
  emailTokenExpiration: Date;

  @Prop({ nullable: true, default: null })
  resetPasswordToken: string;

  @Prop({type: Date, nullable: true })
  resetTokenExpiration: Date;

  @Prop({ default: false })
    suspended: boolean;

    @Field(() => GraphQLTimestamp)
    createdAt: Date;

    @Field(() => GraphQLTimestamp)
    updatedAt: Date;


}

export const PlannerSchema = SchemaFactory.createForClass(Planner)