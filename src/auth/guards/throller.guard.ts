import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    return { req: gqlContext.req, res: gqlContext.req.res };
  }

  protected getTracker(req: any) {
    return req.ip;
  }
}
