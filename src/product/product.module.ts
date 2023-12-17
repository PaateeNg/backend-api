import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { productMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { VendorModule } from 'src/vendor/vendor.module';

@Module({
  imports: [
    AuthModule,
    productMongooseFeature,
    VendorModule
],
  providers: [ProductService, ProductResolver]
})
export class ProductModule {}
