import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import mongoose from "mongoose";
import messages from '@/model/User'

export async function DELETE(request:Request,{params}:{params:{messgaeid:string}}){
    const messageId = params.messgaeid
     await dbConnect()
     const session = await getServerSession(authOptions)
    const user: User = session?.user  as User
 
    if(!session || !session.user){
     return Response.json(
         {
             success: false,
             message: " NOt Authenticated"
         },
         {
             status:401
         }
     )
    }

    try {
    const updateResult=    await UserModel.updateOne(
            {_id: user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        if(updateResult.modifiedCount==0){
            return Response.json(
                {
                    success: false,
                    message: " Messages not found or already delted"
                },
                {
                    status:404
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Messages Deleted"
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error is delete message routr", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting meassage"
            },
            {
                status:500
            }
        )
    }

}