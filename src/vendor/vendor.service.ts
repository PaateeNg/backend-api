import {
  BadRequestException,
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
import { JwtService } from '@nestjs/jwt';
import { CreateAccountWithOughtDto } from 'src/auth/input-dto/auth-input.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async createVendor(payload: VendorInput) {
    const { password, email } = payload;
    try {
      const hashedPassword = await hashed(password);

      const newVendor = await this.vendorModel.create({
        ...payload,
        password: hashedPassword,
      });

      // await this.otpService.sendOtp({
      //   email: email,
      //   type: OtpEnumType.AccountVerification,
      // });

      return newVendor;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async createVendorWithGoogle(payload: CreateAccountWithOughtDto) {
    const { email } = payload;

    const accessToken = await this.jwtToken(email);
    const newUser = await this.vendorModel.create({
      email: email,
      isUser: true,
      isGoogleAuth: true,
      accessToken: accessToken.Response,
      isAccountVerified: true,
    });

    return newUser;
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
    vendorId: string,
  ): Promise<VendorDocument> {
    try {
      const vendorExist = await this.getById(vendorId);

      if (!vendorExist) {
        throw new NotFoundException('Vendor Not Found');
      }

      if (vendorId.toString() !== vendorExist._id.toString()) {
        throw new UnauthorizedException('Not Authorized');
      }
      if (vendorExist.isAccountSuspended) {
        throw new UnauthorizedException('Contact Support');
      }
      const updatedVendor = await this.vendorModel.findOneAndUpdate(
        { _id: vendorId },
        payload,
        {
          new: true,
        },
      );

      if (!updatedVendor) {
        throw new ConflictException('Failed to update vendor');
      }

      return updatedVendor;
    } catch (error) {
      if (error instanceof NotFoundException || UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async getAllVendors(): Promise<VendorDocument[]> {
    try {
      const vendors = await this.vendorModel.find({
        isAccountSuspended: false,
        // isVendorApproved: true,
        isDeleted: false,
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
      return;
    }
    return vendor;
  }

  async jwtToken(payload: any) {
    const jwtPayload = {
      id: payload._id,
    };

    return {
      Response: this.jwtService.sign(jwtPayload),
    };
  }

  async deleteVendorByEmail(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Vendor Not found or has already deleted');
    }
    await this.vendorModel.findOneAndDelete({ email: email }, { new: true });
    return {
      Response: 'Vendor deleted successfully',
    };
  }

  async updateProfilePicture(
    vendor: VendorDocument,
    file: Express.Multer.File,
  ): Promise<returnString> {
    console.log('current vendor', vendor);
    console.log(file);
    return;
  }
}
