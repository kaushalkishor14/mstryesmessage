/* eslint-disable react-hooks/rules-of-hooks */
'use client '

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { singUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"



 const page = () => {

  const[username, setUsername] = useState('');
  const[ usernameMessage, setUsernameMessage] = useState('');
  const[isCheckingUsername, setIsCheckingUsername] = useState(false);
  const[isSubmting, setIsSubmitinhg ] = useState(false)

  const debouncedUsername =useDebounceValue(username,300);

  const { toast } = useToast();
  const router = useRouter();

// zod implementation 
  const from = useForm<z.infer<typeof singUpSchema>>({
    resolver: zodResolver(singUpSchema),
    defaultValues:{
      username:"",
      email:'',
      password:''
    }
  })

  useEffect(()=>{

    const checkUsernameUnique = async ()=>{
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
         const response = await axios.get(`/api/check-username-uniq?
          username=${debouncedUsername}`)

          setUsernameMessage(response.data.message)
        } catch (error) {
          const  axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username"
          )
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()

  },[debouncedUsername])


  const onSubmit = async(data: z.infer<typeof singUpSchema>) =>{
    
    setIsSubmitinhg(true)
    try {
    const response =  await axios.post<ApiResponse>('/api/sign-up', data)
    toast({
      title : 'Success',
      description: response.data.message
    })

    router.replace(`/verify/${username}`)
      setIsSubmitinhg(false)
    } catch (error) {
      console.error("Error in singup of user" ,error)
      const  axiosError = error as AxiosError<ApiResponse>
        let errorMessage = axios
      setIsSubmitinhg(false)
    }



  }

  return (
    <div>page</div>
  )
}

export default page

//Vh18kwiDKjqo8duN