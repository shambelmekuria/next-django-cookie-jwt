import { DJANGO_BASE_URL } from "@/config/defualt";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

const TOKEN_NAME = "access-token";
const REFRESH_TOKEN_NAME = "refresh-token";
const TOKEN_AGE = 3600;
type DecodedValues = {
  username: string;
  fullname: string;
  role: string;
};

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const response = await axios.post(`${DJANGO_BASE_URL}/api/token/`, data);
    const { access, refresh } = response.data;
    // decoded/translate token to readable format
    const decoded = jwtDecode<DecodedValues>(`${access}`);
    // Send access token to cookies browser storage
    const res = NextResponse.json({fullname:decoded.fullname,username:decoded.username,role:decoded.role ,login: true }, { status: 200 });
    res.cookies.set({
      name: TOKEN_NAME,
      value: access,
      httpOnly: true,
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: TOKEN_AGE,
      path: "/",
    });
    res.cookies.set({
      name: REFRESH_TOKEN_NAME,
      value: refresh,
      httpOnly: true,
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
      secure: process.env.NODE_ENV !== "development",
      maxAge: TOKEN_AGE,
      path: "/",
    });
    return res;
  } catch (error) {
    return NextResponse.json({ login: false }, { status: 401 });
  }
}
