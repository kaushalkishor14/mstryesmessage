import {z} from 'zod';

export const usernameValidation = z
  .string()
  .min(2,"user must be atlist 2 characters")
  .max(20,"username must be no more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not containe special character")


  export const singUpSchema = z.object({
   username: usernameValidation,
   email: z.string().email({message: 'inalid email address'}),
   password: z.string().min(6,{message: "password atlist 6 characters"})
  })