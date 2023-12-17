import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@ObjectType()
@Schema({timestamps: true})
export class Booked extends Document {
    @Field(()=>String)
    _id?: mongoose.Types.ObjectId;

    @Field()
    @Prop({ nullable: true })
    email: string;

    @Field()
    @Prop()
    phoneNumber: string;

    @Field()
    @Prop()
    eventDate: string;

    @Field()
    @Prop()
    eventType: string;

    @Field()
    @Prop()
    eventLocation: string;

    @Field(type => [String], {nullable: true})
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product' })
    productid?: mongoose.Types.ObjectId[];

    @Field(type => [String] )
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Vendor' })
    vendorid: mongoose.Types.ObjectId[];

    // Booking with users relation
    @Field(type => String)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userid: mongoose.Types.ObjectId;
}

export const BookedSchema = SchemaFactory.createForClass(Booked);
