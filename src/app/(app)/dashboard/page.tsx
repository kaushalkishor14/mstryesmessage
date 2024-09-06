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
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/context/ui/MessageCard";

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

 const baseUrl =`${window.location.protocol} //${window.location.host}`
 const profileUrl = `${baseUrl}/u//${username}`


 const copyToClipboard = () =>{

  navigator.clipboard.writeText(profileUrl)
  toast({
    title: "Url copied",
    description: "profileUrl is copied to chilpboard"
  })
  

 }
  
 


  if(!session || !session.user){
    return <div>PLease login</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  )
}


export default page;
