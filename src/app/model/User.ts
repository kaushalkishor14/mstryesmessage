import exp from "constants";
import mongoose, {Schema,Document} from "mongoose";
import { Content } from "next/font/google";

export interface Message extends Document{
    Content:string;
    createdAt:Date
}

const MessageSchema : Schema<Message> = new Schema({
    Content:{
        type : String,
        required: true
    },
    createdAt:{
        type : Date,
        required:true,
        default:Date.now
    }
});
// interface of  user
export interface User extends Document{
   username:string;
   email:string;
   password:string;
   verifyCode:string;
   verifyCodeExpiry:Date;
   isVerified:boolean;
   isAcceptingMessage:boolean;
   messages:Message[]
}

// schema of user 
const UserSchema : Schema<User> = new Schema({
    username:{
        type : String,
        // passing custom message
        required: [true , "username is reqiured"],
        trim: true,
        unique:true
    },
    email:{
        type : String,
        required:[true , "email is reqiured"],
        unique:true,
        // vaild email hai yaa nhi esko test kr shkte first value regExr used for check vaild eamil ,second custom message
        match: [/.+\@.+\..+/, 'please use a vaild emial adress']
        
    },
    password:{
        type:String,
        required:[true, "password is required "]

    },
    verifyCode:{
        type:String,
        required:[true, "verifyCode is required "]

    },
    verifyCodeExpiry:{
        type:Date,
        required:[true, "verifyCode is required "]

    },
    isVerified:{
        type:Boolean,
       default:false,

    },
    isAcceptingMessage:{
        type:Boolean,
       default:true,

    },
    messages:[MessageSchema]


});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;