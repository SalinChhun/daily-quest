import { getServerSession } from "next-auth";
import { authOptions } from "./config";

// Get current session using NextAuth
export async function getSession() {
	const session = await getServerSession(authOptions);
	return session?.user?.id || null;
}

// Get full session object
export async function getFullSession() {
	return await getServerSession(authOptions);
}

