import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"No user is logged in"
        },{status:401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {
                $match:{_id : userId}
            },
            {
                $unwind: '$messages'
            },
            {
                $sort:{
                    'messages.createdAt':-1
                }
            },
            {
                $group: {
                    _id:'$_id',
                    messages: {$push:'$messages'}
                }
            }
        ]);
        if(!user || user.length === 0){
            return Response.json({
                success:false,
                messages:"No user found or no messages found"
            },{status:402})
        }
        return NextResponse.json({
            success:true,
            messages:user[0].messages
        },{status:200})
    } catch (error) {
        console.log("Unexpected server error", error);
        return Response.json({
            success:false,
            message:"Unexpected server error | Message couldnt be fetched"
        },{status:500})
    }
}