// This route is no longer needed - NextAuth handles signout
// Keeping for backwards compatibility but redirecting to NextAuth signout
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.redirect(new URL("/api/auth/signout", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}

