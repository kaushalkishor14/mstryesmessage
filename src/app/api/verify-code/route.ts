import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request){
    await dbConnect()

    try {
    const {username, code} =   await request.json()

    decodeURIComponent(username)

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


