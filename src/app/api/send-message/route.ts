import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {Message} from "@/model/User.model";

export async function POST(request:Request){
    await dbConnect();
    const {username, content} = await request.json();
    try {
        const foundUser = await UserModel.findOne({username});
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found or dosent exists"
            },{status:404})
        }

        //is user accepting
        if(!foundUser.isAccepting){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{status:403})
        }
        const newMessage = {content, createdAt: new Date()};
        foundUser.messages.push(newMessage as Message);
        await foundUser.save();

        return Response.json({
            success:true,
            message:"Message sent successfully"
        },{status:200});
    } catch (error) {
        console.log("Unexpected server error", error);
        return Response.json({
            success:false,
            message:"Unexpected server error | Message couldnt be posted or sent"
        },{status:500})
    }
}