import dbConnect from "@/lib/dbConnect";
import {z} from 'zod';
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    
    //can use this in all other routes
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success:false, 
    //         message:"Method \"GET\" is ony allowed"
    //     },{status: 404})
    // }

    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success:false, 
                message:usernameErrors?.length>0 ? usernameErrors.join(', ') : "Invalid query parameter"
            },{status: 401})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({username, isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false, 
                message:"User with this username exists"
            },{status: 400})
        }
        return Response.json({
            success:true, 
            message:"Username is unique"
        },{status: 200})

    } catch (error) {
        console.error("Error checking user name",error);
        return Response.json({success:false, message:"Error checking username uniqueness"},{status:500});
    }
}