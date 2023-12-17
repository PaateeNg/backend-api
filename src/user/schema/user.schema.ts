import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Role } from "src/common/enum/role.enum";

@ObjectType()
@Schema({timestamps: true})
export class User extends Document{
    @Field(()=>String)
    _id?: mongoose.Types.ObjectId;

    @Field()
    @Prop()
    firstName: string;

    @Field()
    @Prop()
    lastName: string;

    @Field()
    @Prop({type: String, unique: true})
    email:string;

    @Field()
    @Prop()
    phoneNumber: String;

    @Field()
    @Prop()
    password: string;

    //handle by both users and admin
    @Prop({default: false, type: Boolean})
    deleted: boolean

    @Prop({default: false, type: Boolean})
    suspended: boolean


    @Field()
    @Prop({enum: Role, default: Role.USER})
    role: Role


    //handle by only admin
    @Field()
    @Prop({default: false, type: Boolean})
    verifed: boolean


    @Prop({default: false, type: Boolean})
    emailConfirmed: boolean;

    @Prop({type: String, default: null})
    emailConfirmedToken: string;

    @Prop({type: Date, default: null})
    emailTokenExpiration: Date;

    @Prop({type: String, default: null})
    resetPasswordToken: string;

    @Prop({type: Date, default: null})
    resetTokenExpiration: Date;
}


export const UserSchema = SchemaFactory.createForClass(User)