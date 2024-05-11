import { Module } from '@nestjs/common';
import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, VendorSchema } from './schema/vendor.schema';
import { OtpModule } from '../otp/module/otp.module';

@Module({
  imports: [
    OtpModule,
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],

  providers: [VendorResolver, VendorService],
  exports: [VendorService],
  controllers: [],
})
export class VendorModule {}
