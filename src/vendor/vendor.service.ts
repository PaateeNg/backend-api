import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateVendorDto, VendorInput } from './input/vendor.input';
import { hashed } from 'src/common/hashed/util.hash';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor, VendorDocument } from './schema/vendor.schema';
import { Model } from 'mongoose';
import { returnString } from 'src/common/return/return.input';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpEnumType } from 'src/otp/enum/otp.enum';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    private otpService: OtpService,
  ) {}

  async createVendor(payload: VendorInput) {
    const { password, email } = payload;
    try {
      const hashedPassword = await hashed(password);

      const newVendor = await this.vendorModel.create({
        ...payload,
        password: hashedPassword,
      });

      await this.otpService.sendOtp({
        email: email,
        type: OtpEnumType.AccountVerification,
      });

      return newVendor;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }
  async getByEmailOrBusinessName(email: string, businessName: string) {
    const vendorExist = await this.vendorModel.findOne({
      email,
      businessName,
    });

    if (!vendorExist) {
      return;
    }

    return vendorExist;
  }
  async getByEmail(email: string): Promise<VendorDocument> {
    const vendorExist = await this.vendorModel.findOne({ email: email });

    if (!vendorExist) {
      return;
    }

    return vendorExist;
  }

  async updateVendor(
    payload: UpdateVendorDto,
    vendor: VendorDocument,
  ): Promise<returnString> {
    try {
      const vendorExist = await this.getById(vendor._id);

      if (vendor._id.toString !== vendorExist._id.toString()) {
        throw new UnauthorizedException('Not Authorized');
      }
      if (vendor.isAccountSuspended) {
        throw new UnauthorizedException('Contact Support');
      }
      const updatedVendor = await this.vendorModel.findOneAndUpdate(
        { _id: vendor._id },
        { payload },
        {
          new: true,
        },
      );

      if (!updatedVendor) {
        throw new ConflictException('Failed to update vendor');
      }

      return {
        Response: 'Updated Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async getAllVendors() {
    try {
      const vendors = await this.vendorModel.find({
        suspended: false,
        approved: true,
        deleted: false,
      });

      return vendors;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch vendors');
    }
  }

  async getById(id: string): Promise<VendorDocument> {
    const vendor = await this.vendorModel.findOne({
      _id: id,
    });

    if (!vendor) {
      throw new NotFoundException('vendor not found');
    }
    return vendor;
  }

  async getByIdForGUse(id: string) {
    const vendor = await this.vendorModel.findOne({
      _id: id,
    });
    if (!vendor) {
      return;
    }
    return vendor;
  }
}
