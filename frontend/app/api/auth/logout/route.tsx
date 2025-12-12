import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "@/config/defualt";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    const res = NextResponse.json({},{status:200})
    res.cookies.delete(TOKEN_NAME);
    res.cookies.delete(REFRESH_TOKEN_NAME)
    return res
}