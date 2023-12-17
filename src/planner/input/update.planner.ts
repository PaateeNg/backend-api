import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class updatePlannerDto{

    @Field({nullable: true})
    firstName: string;

    @Field({nullable: true})
    lastName: string;

    @Field({nullable: true})
    bussineName: string;

    @Field({nullable: true})
    location: string;

    @Field({nullable: true})
    category: string;

     @Field({nullable: true})
     years_of_Experience: string;

     @Field({nullable: true})
     businessPhone: string;

}

