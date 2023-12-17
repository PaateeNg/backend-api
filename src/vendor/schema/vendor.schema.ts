import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Role } from "src/common/enum/role.enum";

@ObjectType()
  @Schema({timestamps: true})
  export class Vendor extends Document {
    @Field(()=>String)
    _id?: mongoose.Types.ObjectId;

    @Field()
    @Prop()
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
    @Prop({enum: Role, default: Role.VENDOR})
    role: Role
  
    @Field()
    @Prop({ default: false, type: Boolean})
    approved: boolean;

    @Field()
    @Prop({ default: false, type: Boolean})
    deleted: boolean;

    @Field()
    @Prop({ default: false })
    suspended: boolean;

    @Field()
  @Prop({nullable: true, default: null})
  location: string;

  @Field()
  @Prop({nullable: true, default: null})
  category: string;

  @Field()
  @Prop({ nullable: true, default: null })
  years_of_Experience: string;

  @Field()
  @Prop({ nullable: true, default: null })
  profilePicture: string;

  @Field()
  @Prop({default: null, nullable: true}) 
  businessPhone: string;

  // @Field(type => [String] )
  //   @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product' })
  //   productmenu: mongoose.Types.ObjectId[];

  @Field(()=>[String])
  @Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}])
  productmenu?: [mongoose.Types.ObjectId];
  
    

    @Prop({ default: false })
    emailConfirmed: boolean;

    @Prop({nullable: true})
    emailConfirmedToken: string;
    
    @Prop({ type: Date, nullable: true })
    emailTokenExpiration: Date;

    @Prop({ nullable: true })
    resetPasswordToken: string;

    @Prop({type: Date, nullable: true })
    resetTokenExpiration: Date;

  }

  export const VendorSchema = SchemaFactory.createForClass(Vendor)
  