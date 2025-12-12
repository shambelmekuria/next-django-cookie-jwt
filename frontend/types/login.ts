import { loginFormSchema } from '@/zod/login'
import {z} from 'zod'

export type loginFormValues=z.infer<typeof loginFormSchema>