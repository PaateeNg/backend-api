import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { addToCartMongooseFeature, bookedMongooseFeature, plannerMongooseFeature, productMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    productMongooseFeature,
    addToCartMongooseFeature

],
  providers: [CartResolver, CartService],
  controllers: [CartController]
})
export class CartModule {}
