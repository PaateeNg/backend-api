import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Role } from "src/common/enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext):boolean{
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context);
         const {req} = ctx.getContext();
        
        const user = req.user;

        //you might need to implement graphql here for it to work on graphql 

       // console.log(user.role)

        return  isRoledMatched(roles, user.role)
        //the user.role is coming from database based on the user role
    }

    
}

const isRoledMatched =  (roles, userRole)=>{
        if (!roles.includes(userRole)) {
            return false
        }
        return true
}