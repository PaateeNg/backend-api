import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/addtocart.schema';
import { UserDocument } from 'src/user/schema/user.schema';
import { PlannerDocument } from 'src/planner/schema/planner.schema';
import { CreateCartDto } from './input/addtocartinput';
import { ProductService } from 'src/product/product.service';
import { Item } from './schema/sub-cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    private readonly productService: ProductService,
  ) {}

  async addToCart(
    payload: CreateCartDto,
    user: UserDocument | PlannerDocument,
  ): Promise<CartDocument> {
    const { items } = payload;

    let cart: { productId: string; quantity: number; price: number }[] = [];

    let totalPrice = 0;

    await Promise.all(
      items.map(async (item) => {
        const product = await this.productService.getById(item.productId);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }
        cart.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        });
        return product;
      }),
    );

    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    const createCart = await this.cartModel.create({
      priceTotal: totalPrice,
      items: cart,
      userId: user._id,
    });

    return createCart;
  }
}
