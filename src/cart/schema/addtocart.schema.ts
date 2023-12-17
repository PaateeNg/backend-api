import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@ObjectType()
@Schema({timestamps:true})
export class AddToCart extends Document{

    @Field(()=>String)
    _id?: mongoose.Types.ObjectId;
    
    @Field({nullable: true})
    @Prop({default: 1})
    quantity?: number

    @Field(()=>[String])
    @Prop()
    items: string[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userid: mongoose.Types.ObjectId;

}

export const AddToCartSchema = SchemaFactory.createForClass(AddToCart)