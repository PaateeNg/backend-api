import { ExecutionContext, createParamDecorator } from "@nestjs/common";

//this is actually to get current logged in user in a restapi
export const GetRestApiCurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      
      const request = ctx.switchToHttp().getRequest();
      console.log(request.user)
      return request.user;
    },
  );