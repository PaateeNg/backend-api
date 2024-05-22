import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateProductInput,
  FindProductByNameDto,
  UpdateProductsInput,
} from './input/product.dto';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { VendorDocument } from 'src/vendor/schema/vendor.schema';
import { ProductDetails, ProductsAndCount } from './input/return/return.input';
import { returnString } from 'src/common/return/return.input';
import { Query } from 'express-serve-static-core';
import { PaginationDto } from 'src/repository/dto/repository.dto';
import { RepositoryService } from 'src/repository/repository.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private repositoryService: RepositoryService,
  ) {}

  async create(
    payload: CreateProductInput,
    vendor: VendorDocument,
  ): Promise<ProductDocument> {
    const { price } = payload;
    try {
      if (vendor.isVendorApproved === false) {
        throw new UnauthorizedException(`your account is not active yet`);
      }
      if (vendor.isAccountSuspended) {
        throw new UnauthorizedException('Contact Support');
      }

      if (vendor.isDeleted) {
        throw new UnauthorizedException(`Not Authorized`);
      }

      const charge = payload.price * 0.1;

      const newPrice = price + charge;

      //image function will here

      const product = await this.productModel.create({
        ...payload,
        price: newPrice,
        creatorId: vendor._id,
      });

      vendor.productMenu.push(product._id);

      await vendor.save();

      return product;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async update(
    id: string,
    payload: UpdateProductsInput,
    vendor: VendorDocument,
  ) {
    try {
      const product = await this.getById(id);

      if (product.creatorId.toString() !== vendor._id.toString()) {
        throw new UnauthorizedException('Not Authorized');
      }
      if (product.isDeleted) {
        throw new NotFoundException('product not found');
      }

      const updatedProduct = await this.productModel.findOneAndUpdate(
        { _id: id },
        { payload },
        {
          new: true,
        },
      );

      if (!updatedProduct) {
        throw new GraphQLError('Failed to update product');
      }

      return 'product updated successfully';
    } catch (error) {
      throw new InternalServerErrorException('server error');
    }
  }

  async getAll(): Promise<ProductDocument[]> {
    return await this.productModel.find({
      isDeleted: false,
      isProductApproved: true,
    });
  }

  async findProductByName(
    query: FindProductByNameDto,
  ): Promise<ProductDocument[]> {
    const { page } = query;
    const currentPage = page || 1;
    const skip = page * (currentPage - 1);

    const keyword = query.keyword
      ? {
          productName: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    return await this.productModel
      .find({ ...keyword, isDeleted: false, isProductApproved: true })
      .limit(page)
      .skip(skip)
      .exec();
  }

  async getProductTimeLime(query?: PaginationDto): Promise<ProductDetails> {
    const data = await this.repositoryService.pagination(
      this.productModel,
      query,
      {
        isDeleted: false,
        isProductApproved: true,
      },
    );

    return {
      data: data.data,
      metadata: data.metadata,
    };
  }

  async getById(id: string): Promise<ProductDocument> {
    try {
      const product = await this.productModel.findOne({
        _id: id,
        isDeleted: false,
        isProductApproved: true,
      });

      if (!product) {
        throw new NotFoundException('Product Not Found');
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Server error');
    }
  }

  async findProductsNotApproved(): Promise<ProductsAndCount> {
    try {
      const totalProductCount = await this.productModel.countDocuments({
        isProductApproved: false,
        isDeleted: false,
      });
      const products = await this.productModel.find({
        deleted: false,
        approved: false,
      });

      return {
        products,
        totalProductCount,
      };
    } catch (error) {
      throw new InternalServerErrorException('server error');
    }
  }

  async deletedProductById(
    productId: string,
    vendorId: string,
  ): Promise<returnString> {
    try {
      const product = await this.getById(productId);

      if (product.creatorId.toString() !== vendorId.toString()) {
        throw new UnauthorizedException('Not Authorized');
      }

      if (product.isDeleted) {
        throw new NotFoundException('Product Not Found ');
      }
      product.isDeleted = true;

      await product.save();

      return {
        Response: `Product Deleted`,
      };
    } catch (error) {
      if (error instanceof NotFoundException || UnauthorizedException) {
        throw error.message;
      }
      throw new InternalServerErrorException('server error');
    }
  }

  //   async approveProductById(id: string): Promise<returnString> {
  //     try {
  //       const product = await this.productModel.findById(id);
  //       if (!product) {
  //         throw new HttpException('product id not found', HttpStatus.NOT_FOUND);
  //       }
  //       if (product.isDeleted) {
  //         throw new HttpException(
  //           `product you want to approve is deleted, you can't approve deleted product`,
  //           HttpStatus.FORBIDDEN,
  //         );
  //       }
  //       if (product.approved === true) {
  //         throw new HttpException(
  //           `product with ${product._id} has already been approved`,
  //           HttpStatus.CONFLICT,
  //         );
  //       }
  //       const vendor = await this.vendorService.findVendorById(
  //         product.vendorid._id.toString(),
  //       );

  //       if (!vendor) {
  //         throw new HttpException(
  //           `vendor not found product can't be approved `,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       product.approved = true;

  //       product.save();

  //       //send a message to the vendor to inform him that his product uploaded has be approved;
  //       const emailMessage = {
  //         from: 'info@paateeng.com',
  //         to: vendor.email,
  //         subject: 'product approved',
  //         text: `your product has been approved, congratulation!`,
  //       };

  //       await transporter.sendMail(emailMessage);

  //       return {
  //         Response: `product with id ${product._id} has been approved`,
  //       };
  //     } catch (error) {
  //       if (error instanceof HttpException) {
  //         throw error;
  //       }
  //       console.log(error);
  //       throw new InternalServerErrorException('server error');
  //     }
  //   }
}
