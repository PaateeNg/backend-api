import { Module } from '@nestjs/common';
import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { addToCartMongooseFeature, bookedMongooseFeature, plannerMongooseFeature, productMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    userMongooseFeature,
    vendorMongooseFeature,
    plannerMongooseFeature,
  ],
  providers: [
    VendorResolver, 
    VendorService,
    MailService,
    ConfigService
  ],
  exports: [VendorService],
  controllers: []
})
export class VendorModule {}
