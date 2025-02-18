import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    // const user = session?.user;
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"No user is logged in"
        },{status:401})
    }

    const userId = user?._id;
    const {acceptMessages} = await request.json();

    try {
        const udpatedUser = await UserModel.findByIdAndUpdate(userId,{isAccepting: acceptMessages},{new:true});
        if(!udpatedUser){
            return Response.json({
                success:false,
                message:"No user found"
            },{status:401})
        }
        return Response.json({
            success:true,
            message:"User Status updated",
            udpatedUser
        },{status:200})

    } catch (error) {
        console.log("Failed to update user status to accept message");
        return Response.json({
            success:false,
            message:"Failed to update user status to accept message"
        },{status:500});
    }
}

export async function GET(request:Request){
    dbConnect();
    const session = await getServerSession(authOptions);
    // const user = session?.user;
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"No user is logged in"
        },{status:401})
    }

    const userId = user?._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success:false,
                message:"No user found"
            },{status:404})
        }
        return Response.json({
            success:true,
            messages:"User accept status found",
            isAcceptingMessages: foundUser.isAccepting
        },{status:200})
    } catch (error) {
        console.log("Failed to fetch user status of accept message");
        return Response.json({
            success:false,
            message:"Failed to fetch user status of accept message"
        },{status:500});
    }
}