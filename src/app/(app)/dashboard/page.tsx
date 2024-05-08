'use client'

import { useState } from "react";
import {Message} from "@/model/User"
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";

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

  




  return (
    <div>dashboard</div>
  )
}


export default page;
