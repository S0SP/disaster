import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/dashboard',
    '/verify',
    '/proof',
    '/governance',
    '/onboarding',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Basic path check
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // We can't easily check Thirdweb auth in standard edge middleware 
    // without a session cookie or verifying a JWT.
    // For now, we'll rely on Client-side protection in UserProvider/AppLayout
    // but we can add Edge-side JWT verification here in the future.

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/verify/:path*',
        '/proof/:path*',
        '/governance/:path*',
        '/onboarding/:path*',
    ],
};
