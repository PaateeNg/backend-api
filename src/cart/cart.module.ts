import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';

@Module({
  imports: [],
  providers: [CartResolver, CartService],
  controllers: [],
})
export class CartModule {}
