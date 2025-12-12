import { DJANGO_BASE_URL } from "@/config/defualt";
import { getRefreshToken, getToken } from "@/lib/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const TOKEN_NAME = "access-token";
const REFRESH_TOKEN_NAME = "refresh-token";
const TOKEN_AGE = 3600;

export async function GET(request: Request) {
  const token = await getToken();
  const refreshToken = await getRefreshToken();
  const verifyToken = await axios.post(`${DJANGO_BASE_URL}/api/token/verify/`, {
    token,
  });
  const verifyRefreshToken = await axios.post(
    `${DJANGO_BASE_URL}/api/token/verify/`,
    { refreshToken }
  );
  if (verifyToken) {
    NextResponse.json({ login: true }, { status: 200 });
  } else if (verifyRefreshToken) {
    const { access, refresh } = verifyRefreshToken.data;
    const res = NextResponse.json({ login: true }, { status: 200 });
    res.cookies.set({
      name: TOKEN_NAME,
      value: access,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
      maxAge: TOKEN_AGE,
      path: "/",
    });
    res.cookies.set({
      name: REFRESH_TOKEN_NAME,
      value: refresh,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
      maxAge: TOKEN_AGE,
      path: "/",
    });
    return res;
  } else {
    return NextResponse.json({}, { status: 401 });
  }
}
