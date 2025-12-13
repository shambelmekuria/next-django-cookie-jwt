import { DJANGO_BASE_URL, REFRESH_TOKEN_NAME, TOKEN_AGE, TOKEN_NAME } from "@/config/defualt";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get(REFRESH_TOKEN_NAME)?.value
   
        try{
            const response = await axios.post(`${DJANGO_BASE_URL}/api/token/refresh/`,{refresh:token});
            const {access,refresh} = response.data;
            const res = NextResponse.redirect(new URL(request.url));
            res.cookies.set({
                name:TOKEN_NAME,
                value:access,
                sameSite:'strict',
                httpOnly:true,
                secure:process.env.NODE_ENV !== 'development',
                path:'/',
                maxAge:TOKEN_AGE
            })
               res.cookies.set({
                name:REFRESH_TOKEN_NAME,
                value:refresh,
                sameSite:'strict',
                httpOnly:true,
                secure:process.env.NODE_ENV !== 'development',
                path:'/',
                maxAge:TOKEN_AGE
            })
            return res;
        }
        catch{
           const res = NextResponse.redirect(new URL('/login',request.url))
           res.cookies.delete(TOKEN_NAME);
           res.cookies.delete(REFRESH_TOKEN_NAME);
           return res
        }
    }
