import { Content } from 'next/font/google';
import {z} from 'zod';


export const meassageSchema = z.object({
   Content: z
   .string()
   .min(10,{message:"content must be at least of 10 characters"})
   .max(300,{message: "content mustbe no plonger 300 characters"})
   
})