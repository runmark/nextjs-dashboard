import { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ request, auth }) {

            const isLoggedIn = !!auth?.user;
            const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

            if (isDashboard) {
                if (isLoggedIn) return true;
                return false;
            }

            if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', request.nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;