import { cookies } from "next/headers";

// CONSTANTS
const TOKEN_NAME = 'access-token'
const REFRESH_TOKEN_NAME = 'refresh-token'
const TOKEN_AGE = 3600

export async function getToken() {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_NAME)
    return token?.value
}

export async function getRefreshToken() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(TOKEN_NAME);
    return refreshToken?.value
}

// Store access and refresh token
export async function setToken(token: string) {
    const cookieStore = await cookies()
    return cookieStore.set({
        name: 'access-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        maxAge: TOKEN_AGE
    })

}

export async function setRefreshToken(token: string) {
    const cookieStore = await cookies()
    return cookieStore.set({
        name: 'refresh-token',
        value: token,
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE
    })
}

// logout Function
export async function deleteToken() {
    const cookieStore = await cookies();
    cookieStore.delete(REFRESH_TOKEN_NAME);
    return cookieStore.delete(TOKEN_NAME);
}