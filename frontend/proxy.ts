import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from "jwt-decode";
import path from 'path';

type decodeTokenValues = {
    exp: number,
    role: string,
    username: string
}

// Regex for path validation
const admin_paths_regex = /^\/admin/;
const user_paths_regex = /^\/home|^\/$/;

export async function proxy(request: NextRequest) {
    const access_token = request.cookies.get("access-token")?.value;
    const { pathname } = request.nextUrl;

    // Allow login page if no token
    if ((pathname.startsWith('/login') || pathname.startsWith('/password-reset') || pathname.startsWith('/password-reset-confirm')) && !access_token) {
        return NextResponse.next();
    }


    // if there is no token , redirect to login
    if (!access_token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (access_token && pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    // *******************************
    // Password Reset Related        |
    // ******************************
    if (access_token && pathname.startsWith('/password-reset')) {
        // /password-reset include /password-reset-confirm and its token
        const res = NextResponse.next();
        res.cookies.delete('access-token');
        res.cookies.delete('refresh-token')
        return res;
    }

    // Token exists  decode/translate/
    let decoded: decodeTokenValues;
    try {
        decoded = jwtDecode<decodeTokenValues>(access_token);
    }
    catch (err) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Expired token , Rewrite to refresh API
    if (decoded.exp * 1000 < Date.now()) {
        return NextResponse.rewrite(new URL('/api/auth/refresh/', request.url));
    }

    // Can use fetch API instead of rewrite if needed to call refresh endpoint

    // Role-based access control using path regex
    if (admin_paths_regex.test(pathname) && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (user_paths_regex.test(pathname) && decoded.role !== 'user') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login/:path*',
        '/logout/:path*',
        '/admin/:path*',
        '/dashboard/:path*',
        '/home',
        '/',
        '/password-reset',
        '/password-reset-confirm/:path*',
    ]
}
