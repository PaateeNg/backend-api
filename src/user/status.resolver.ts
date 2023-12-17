import { Query, Resolver } from "@nestjs/graphql";
import { returnString } from "src/common/return/return.input";

@Resolver(of=>returnString)
export class StatusResolver{

    @Query(returns => returnString)
    async apistatus():Promise<returnString>{
        return {Response: 'api is ok'}
    }

}