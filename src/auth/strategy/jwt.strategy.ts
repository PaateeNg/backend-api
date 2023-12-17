import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
require('dotenv').config();

export interface JwtPayload{
    user: string
  }
  
  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authservice: AuthService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET,
      })}
  
    async validate(payload: JwtPayload) {
     try {
      const user = await this.authservice.getUserjwt(payload.user);
     
     if (!user) {

          throw new UnauthorizedException('your token is not valid');
  
     }
     return user
     } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new InternalServerErrorException('server error ')
     }
     
    }
  }