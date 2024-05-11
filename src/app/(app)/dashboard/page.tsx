'use client'

import { useCallback, useEffect, useState } from "react";
import {Message} from "@/model/User"
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";

const page = () => {

  const [messages ,setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading , setIsSwitchLoading] = useState(false)


  const {toast} = useToast()

  const handleDeleteMessage = (messageId: string) =>{
    setMessages(messages.filter((message)=> message.id !== messageId))
  }

  const {data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {register, watch , setValue} = form;

  const acceptMessages = watch('acceptMessages')
  // usecallback

  const fetchAcceptMessage = useCallback(async ()  =>{
    setIsLoading(true)

    try {
    const response =  await axios.get<ApiResponse>('/api/accept-message')
    setValue('acceptMessages', response.data.isAcceptingMessage)
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ||
         "Failed to fetch message settings ",
         variant : "destructive"
      })
    }  finally{
      setIsSwitchLoading(false)
    }




  }, [setValue])


  const fetchMessages = useCallback( async(refresh : boolean = false) =>{

    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages  || [])

      if (refresh) {
        toast({
          title: "Refresh messages",
          description:"Showing  lastest messages"
        })
      }

      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ||
         "Failed to fetch message settings ",
         variant : "destructive"
    })
      
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }

  },[setIsLoading , setMessages])

  useEffect (() =>{

    if(!session  || session.user) return
    fetchMessages()
    fetchAcceptMessage()
  
  }, [session ,setValue , fetchAcceptMessage, fetchMessages])

  //  handlechne

  const handleSwitchChange = async () =>{
    try {
     const response = await axios.post<ApiResponse>('/api/accept-messages',
      {
        acceptMessages: !acceptMessages
      } )

      setValue('accpectMessages', !acceptMessages)
      toast({
        title:response.data.message,
        variant:"default"
      }) 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ||
         "Failed to fetch message settings ",
         variant : "destructive"
    })
      
    }
  }

 const {username}= session?.user as User
  

  if(!session || !session.user){
    return <div>PLease login</div>
  }

  return (
    <div>dashboard</div>
  )
}


export default page;
