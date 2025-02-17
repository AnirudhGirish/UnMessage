import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne(({username:decodedUsername}));
        if(!user){
            return Response.json({
                success:false,
                message:"User doesnot exist"
            },{status:400});
        }

        const isValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"User verified successfully"
            },{status:200});
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verify code has expired please signup again to get a new code"
            },{status:400});
        }else{
            return Response.json({
                success:false,
                message:"Verify code not valid"
            },{status:400});
        }

    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500});
    }
}