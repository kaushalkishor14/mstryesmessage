/* eslint-disable react-hooks/rules-of-hooks */
'use client '

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"


 const page = () => {

  const[username, setUsername] = useState('');
  const[ usernameMessage, setUsernameMessage] = useState('');
  const[isCheckingUsername, setIsCheckingUsername] = useState(false);
  const[isSubmting, setIsSubmitinhg ] = useState(false)

  const debouncedUsername =useDebounceValue(username,300);

  const { toast } = useToast();
  const router = useRouter();



  return (
    <div>page</div>
  )
}

export default page

//Vh18kwiDKjqo8duN