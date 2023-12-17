import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './input/createProducts.input';
import { UpdateProductsInput } from './input/updateProduct.input';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { ProductsAndCount } from './input/return/return.input';
import { returnString } from 'src/common/return/return.input';
import { transporter } from 'src/common/nodemailer/email.nodemailer';
import { VendorService } from 'src/vendor/vendor.service';

@Injectable()
export class ProductService {
   
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>,
        private vendorService: VendorService
    ){
        transporter
    }


   async createProducts(createProduct: CreateProductInput, vendor: Vendor):Promise<returnString> {
    try {

        if (vendor.approved === false) {
            throw new HttpException(`your account is not active yet`, HttpStatus.FORBIDDEN)
        }
        if (vendor.suspended === true) {
            throw new HttpException(`you can't create product, kindly chat with one of our support team`, HttpStatus.FORBIDDEN)
        }

        if (vendor.deleted === true) {
            throw new HttpException(`you can't create product, kindly chat with one of our support team`, HttpStatus.FORBIDDEN)
        }

        ///increase price by 10%...check this because for m it is too much
        const newPrice = createProduct.price * 0.5
        //image function will here
    const product= await this.productModel.create({
        ...createProduct,
        price: newPrice,
      vendorid: new Object(vendor._id)
    })
    
     vendor.productmenu.push(product._id)
    await vendor.save();
   const savedproduct = await product.save()

    return {
        Response: `product id ${savedproduct._id} created successfully`
    }

    } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        console.log(error)
        throw new InternalServerErrorException('server error while creating product')
        
    }

    }

   async updateproduct(id: string, updateproduct: UpdateProductsInput) {
    try {
        const product = await this.productModel.findById(id)

    if(product.deleted === true){
        throw new HttpException('product not found', HttpStatus.NOT_FOUND)
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateproduct, {
        new: true,
        runValidators: true
    });

    if (!updatedProduct) {
        throw new GraphQLError('Failed to update product');
    }

    return 'product updated succesfully'

    } catch (error) {
        console.log(error)
        throw new GraphQLError('server error')
    }
    }

    async findProducts() :Promise<ProductsAndCount>{
        try {
            const totalProductcount = await this.productModel.countDocuments();
           
    
            const products = await this.productModel.find({
                deleted: false,
                approved: true
            });
    
            return {products, totalProductcount };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('server error');
        }
    }
    


    async findOneProduct(id: string) {
        try {
         const product = await this.productModel.findOne({
             _id: id,
             deleted: false,
             approved: true 
         });
     
         if (!product) {
             throw new NotFoundException('Product with such ID does not exist or is not approved');
         }
     
         return product;
 
        } catch (error) {
         if (error instanceof NotFoundException) {
             throw error;
           }
       
           throw new InternalServerErrorException('Server error');
      }
        
     }



    async findProductsNotApproved():Promise<ProductsAndCount> {
       try {
        const totalProductcount = await this.productModel.countDocuments({
            approved: false,
            deleted: false
        });
        const products= await this.productModel.find({
            deleted: false,
            approved: false
    })
   
    return {
        products,
        totalProductcount
        
    }
       } catch (error) {
        throw new InternalServerErrorException('server error')
       }
    }

    async deletedProductById(id: string):Promise<returnString> {
        try {
   const product = await this.productModel.findById(id);
   if (!product) {
    throw new HttpException('product id not found', HttpStatus.NOT_FOUND)
   }

   product.deleted = false;

   await product.save()
   return {
    Response: `product with id ${product._id} has been deleted by admin`
   }
   
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
         throw new InternalServerErrorException('server error')
        }
     }

     async approveProductById(id: string): Promise<returnString>{
        try {
            const product = await this.productModel.findById(id);
            if (!product) {
                throw new HttpException('product id not found', HttpStatus.NOT_FOUND)
            }
            if (product.deleted === true) {
                throw new HttpException(`product you want to approve is deleted, you can't approve deleted product`, HttpStatus.FORBIDDEN)
            }
            if (product.approved === true) {
                throw new HttpException(`product with ${product._id} has already been approved`, HttpStatus.CONFLICT)
            }
            const vendor = await this.vendorService.findVendorById(product.vendorid._id.toString());
           
            if (!vendor) {
                throw new HttpException(`vendor not found product can't be approved `, HttpStatus.NOT_FOUND)
            }
            
            product.approved =true;

            product.save();
        
            //send a message to the vendor to inform him that his product uploaded has be approved;
            const emailMessage ={
                from: 'info@paateeng.com',
                to: vendor.email,
                subject: 'product approved',
                text: `your product has been approved, congratulation!`
              }
        
          await transporter.sendMail(emailMessage);

          return {
            Response: `product with id ${product._id} has been approved`
        }
            
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            console.log(error)
            throw new InternalServerErrorException('server error')
        }

        
     }


    
}
