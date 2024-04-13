import { error } from "console";
import mongoose from "mongoose";


type ConnectionObject = {
   isConnected?: number
}

const connection : ConnectionObject ={}

// connection dtatbase check kr rhe hai ki allready connection to nhi hai
async function dbConnect(): Promise<void> {
if(connection.isConnected){
    console.log("Already connected to database");
    return
}



try{
  const db =  await mongoose.connect(process.env.MONGOdB_URI || '',{})

  connection.isConnected =db.connections[0].readyState

  console.log("Db connected successfully ")
} catch{
    console.log("Database connection is failed",error)
process.exit(1)
}
}

export default dbConnect;