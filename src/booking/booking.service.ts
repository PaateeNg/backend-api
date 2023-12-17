import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BookingInput } from './input/booking.input';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Booked } from './schema/booking.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { User } from 'src/user/schema/user.schema';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { returnString } from 'src/common/return/return.input';

@Injectable()
export class BookingService {
    constructor(
    @InjectModel(Booked.name)
    private bookedModel: Model<Booked>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    @InjectModel(Vendor.name)
    private vendorModel: Model<Vendor>
    ){}

async bookedVendor(bookingInput: BookingInput, user: User, vendorid: string[], productid?: string[]):Promise<returnString> {
    try {
        let vendorIdArray = [];
        let productArray = [];

  
        if (user.suspended === true) {
            throw new HttpException(`you can't book a vendor service for now, kindly chat with one of our support team`, HttpStatus.FORBIDDEN)
        }
        // Query vendors and products
        const vendors = await this.vendorModel.find({ _id: vendorid });
        const products = await this.productModel.find({ _id: productid });

        // Push results into arrays
        vendorIdArray.push(...vendors.map(vendor => vendor._id));
        productArray.push(...products.map(product => product._id));

        // Validate products and vendors
        // if (!products || products.length === 0) {
        //     throw new NotFoundException('No products found. Please select a valid product.');
        // }

        if (!vendors || vendors.length === 0) {
            throw new NotFoundException('No vendors found. Please select a valid vendor.');
        }

        // Create booking
        const bookedVendor = await this.bookedModel.create({
            ...bookingInput,
            userid: user._id,
            vendorid: vendorIdArray,
            productid: productArray,
        });

        return {Response: `your book was successfully ${bookedVendor._id}`};

        // Return success message
     //   return `You have successfully booked the vendor with ID ${bookedVendor.vendorid[0]} and products with IDs ${bookedVendor.productid[0]}`;
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw error;
        }
        console.log(error);
        throw new InternalServerErrorException('Server error');
    }
}


}

