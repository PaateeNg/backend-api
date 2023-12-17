import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Booked, BookedSchema } from "src/booking/schema/booking.schema";
import { AddToCart, AddToCartSchema } from "src/cart/schema/addtocart.schema";
import { Planner, PlannerSchema } from "src/planner/schema/planner.schema";
import { Product, ProductSchema } from "src/product/schema/product.schema";
import { User, UserSchema } from "src/user/schema/user.schema";
import { Vendor, VendorSchema } from "src/vendor/schema/vendor.schema";


export const vendorMongooseFeature = MongooseModule.forFeature([
  { name: Vendor.name, schema: VendorSchema},
]);

export const bookedMongooseFeature = MongooseModule.forFeature([
  { name: Booked.name, schema: BookedSchema},
]);

export const addToCartMongooseFeature = MongooseModule.forFeature([
  { name: AddToCart.name, schema: AddToCartSchema},
]);

export const productMongooseFeature = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema},
]);

export const userMongooseFeature = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema},
]);

export const plannerMongooseFeature = MongooseModule.forFeature([
  { name: Planner.name, schema: PlannerSchema},
]);

export const Jwtmodule = JwtModule.registerAsync({
  global: true,
  inject: [ConfigService],
  useFactory: (config: ConfigService)=>{
    return{
      secret: config.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: config.get<string | number>('JWT_EXPIRE_TIME')
      }
    }
  }
})