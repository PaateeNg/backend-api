import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
//import { GqlAuthGuard } from './guards/graphql.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ConfigService } from '@nestjs/config';
import { Jwtmodule, plannerMongooseFeature, userMongooseFeature, vendorMongooseFeature } from 'src/common/mongoose/mongoose.connection';
import { GqlAuthGuard } from './guards/graphql.guard';
import { AuthResolver } from './auth.resolver';
require('dotenv').config();

@Module({
  imports: [
   PassportModule,
    PassportModule.register({
      global:true,
      defaultStrategy: 'jwt'
    }),

    Jwtmodule,
    userMongooseFeature,
    vendorMongooseFeature,
    plannerMongooseFeature
    
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    JwtAuthGuard,
    ConfigService,
    AuthResolver
  ],
  exports: [JwtStrategy, PassportModule, GqlAuthGuard, AuthService],
})
export class AuthModule {}


