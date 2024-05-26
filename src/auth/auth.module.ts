import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ConfigService } from '@nestjs/config';

import { GqlAuthGuard } from './guards/graphql.guard';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PlannerModule } from 'src/planner/planner.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { OtpModule } from 'src/otp/module/otp.module';
import { GoogleStrategy } from './strategy/google.strategy';
require('dotenv').config();

@Module({
  imports: [
    UserModule,
    PlannerModule,
    VendorModule,
    PassportModule,
    OtpModule,

    PassportModule.register({
      global: true,
      defaultStrategy: 'google',
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE_TIME'),
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    GqlAuthGuard,
    JwtAuthGuard,
    AuthResolver,
    JwtStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
