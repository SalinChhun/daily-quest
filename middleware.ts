import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { protectedPaths, authPaths } from "@/lib/constants";

export async function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

	if (token) {
		if (authPaths.includes(url.pathname)) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return NextResponse.next();
	} else {
		if (protectedPaths.includes(url.pathname)) {
			const next = url.searchParams.get("next") || url.pathname;
			return NextResponse.redirect(new URL(`/auth?next=${next}`, request.url));
		}
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
