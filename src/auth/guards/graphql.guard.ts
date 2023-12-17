import { AuthenticationError } from "@nestjs/apollo";
import { ExecutionContext, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
//import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";


//get current logged in user in graphql
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();


        return super.canActivate(
            new ExecutionContextHost([req]),
        );
    }

    handleRequest(err: any, user: any) {
     
        if (err || !user) {
     
            throw err || new AuthenticationError('not authorized');   
    }
    
    return user;
    }


}

