import * as z from 'zod'

export const loginFormSchema = z.object(
    {
        username:z.string().min(1,"Password Can`t be Empty"),
        password:z.string().min(1,"Password Can`t be Empty")
    }
)