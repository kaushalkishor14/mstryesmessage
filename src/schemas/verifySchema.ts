import {z} from 'zod';


export const verifySchema = z.object({
    code:z.string().length(6, 'verification code musr be 6 digits')
})