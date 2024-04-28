import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { use } from "react";


export async function POST(request: Request){
    await dbConnect()

    try {
    const {username, code} =   await request.json()

   const decodedUsername = decodeURIComponent(username)
const user = await UserModel.findOne({username: decodedUsername})

if(!user){
    return Response.json(
        {
            success: false,
            message:"User not found"
        },
        {status:500}
    )
}

const isCodeVaild = user.verifyCode === code
const isCodeExpire = new Date(user.verifyCodeExpiry) > new Date()

if(isCodeVaild && isCodeExpire){
    user.isVerified == true
    await user.save()

    return Response.json(
        {
            success: true,
            message:"Account verified successfully"
        },
        {status:200}
    )
} else if (!isCodeExpire){
    return Response.json(
        {
            success: false,
            message:"Verification code has expired"
        },
        {status:400}
    )

} else{
    return Response.json(
        {
            success: false,
            message:"Incorrect Verification code"
        },
        {status:400}
    )

}


    } catch (error) {
        console.error("Error verifying  username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status:500}
        )
    }
}


