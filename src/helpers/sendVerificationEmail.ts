import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verififcationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(

    emails:string,
    username:string,
    verifyCode:string

):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'email',
            subject: 'mstryesmessage | Verification code',
            react: VerificationEmail({username, otp:verifyCode}),
          });
        return {success:true,message:"verification eamil send successfully"}
    } catch (emailerror) {
        console.error("Error sending verification email",emailerror)
        return {success:false,message:"failed to send verification eamil"}
        
    }
}