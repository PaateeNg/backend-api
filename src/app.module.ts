import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';
import { PlannerModule } from './planner/planner.module';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpModule } from './otp/module/otp.module';
import { RepositoryModule } from './repository/repository.module';
import { PaymentModule } from './payment/module/payment.module';

require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //code first approach
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONG_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    VendorModule,
    PlannerModule,
    ProductModule,
    MailModule,
    BookingModule,
    CartModule,
    OtpModule,
    RepositoryModule,
    PaymentModule,
  ],
})
export class AppModule {}
