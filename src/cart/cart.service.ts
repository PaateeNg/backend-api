
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddToCartInput } from './input/cart.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddToCart } from './schema/addtocart.schema';
import { User } from 'src/user/schema/user.schema';
import { Product } from 'src/product/schema/product.schema';
import { returnString } from 'src/common/return/return.input';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    @InjectModel(AddToCart.name)
    private addToCartModel: Model<AddToCart>,
  ) {}

  async addToCart(addToCartInput: AddToCartInput, user: User):Promise<returnString> {
    try {
      // Validate input
      if (!addToCartInput || !addToCartInput.items || !user) {
        throw new HttpException('Invalid input.', HttpStatus.BAD_REQUEST);
      }

      // Check if the products exist
      const productIds = addToCartInput.items.map(item => item.productid);
      const products = await this.productModel.find({ _id: { $in: productIds } });

      // Check for product existence
      if (products.length !== productIds.length) {
        throw new HttpException('One or more products not found.', HttpStatus.NOT_FOUND);
      }

      // Create a new item in the cart
      const addedToCart = await this.addToCartModel.create({
        items: addToCartInput.items.map(item => ({
          productid: item.productid,
          quantity: item.quantity,
        })),
        userid: user._id,
      });

      return {Response: `item added`};
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Server error');
    }
  }
  
}