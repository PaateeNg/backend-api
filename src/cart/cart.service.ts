import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddToCart } from './schema/addtocart.schema';
import { Product } from 'src/product/schema/product.schema';

@Injectable()
export class CartService {
  constructor() {}

  // async addToCart(addToCartInput: AddToCartInput, user: User):Promise<returnString> {
  //   try {
  //     // Validate input
  //     if (!addToCartInput || !addToCartInput.items || !user) {
  //       throw new HttpException('Invalid input.', HttpStatus.BAD_REQUEST);
  //     }

  //     // Check if the products exist
  //     const productIds = addToCartInput.items.map(item => item.productId);
  //     const products = await this.productModel.find({ _id: { $in: productIds } });

  //     // Check for product existence
  //     if (products.length !== productIds.length) {
  //       throw new HttpException('One or more products not found.', HttpStatus.NOT_FOUND);
  //     }

  //     // Create a new item in the cart
  //     const addedToCart = await this.addToCartModel.create({
  //       items: addToCartInput.items.map(item => ({
  //         productid: item.productid,
  //         quantity: item.quantity,
  //       })),
  //       userid: user._id,
  //     });

  //     return {Response: `item added`};
  //   } catch (error) {
  //     console.error(error);
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException('Server error');
  //   }
  // }
}
