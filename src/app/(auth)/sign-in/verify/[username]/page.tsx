'use client'; 
import { useToast } from "@/components/ui/use-toast";

import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation"
import {  useForm } from "react-hook-form";
import * as z from 'zod';
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form,  } from "@/components/ui/form";
import { Input } from '@/components/ui/input';



const VerifyAccount = () => {

    const router = useRouter();
    const param = useParams<{username: string}>()
    const {toast}  =  useToast()

    //   zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
   
  }
);

const onSubmit = async(data: z.infer<typeof verifySchema>) =>{


    try {
        
     const response =   await axios.post(`/api/verify-code`,{
            username : param.username,
            code: data.code
        })

        toast({
            title: 'Success',
            description: response.data.message,
          });

          router.replace('sign-in')
    } catch (error) {
        console.error('Error during sign-up:', error);

        const axiosError = error as AxiosError<ApiResponse>;
  
        // Default error message
        let errorMessage = axiosError.response?.data.message;
        ('There was a problem with your sign-up. Please try again.');
  
        toast({
          title: 'Sign Up Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        
    }
}
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4"> Enter the verification code send to your email</p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}


export default VerifyAccount
