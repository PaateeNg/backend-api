import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ENVIRONMENT } from 'src/common/constant/environment/env.variable';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: ENVIRONMENT.GOOGLE_OUGHT.CLIENT_ID,
      clientSecret: ENVIRONMENT.GOOGLE_OUGHT.CLIENT_SECRET,
      callbackURL: ENVIRONMENT.GOOGLE_OUGHT.CALL_BACK_URL,
      scope: ENVIRONMENT.GOOGLE_OUGHT.scope,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    //return user
    done(null, user);
  }
}
