import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ENVIRONMENT } from 'src/common/constant/environment/env.variable';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: +ENVIRONMENT.THROTTLER.TTL,
        limit: +ENVIRONMENT.THROTTLER.TT_LIMIT,
      },
    ]),
  ],
})
export class ThrottlerMod {}
