import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { getPrismaServer } from "@/lib/prisma/server";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (!user.email || !account) return false;

			const prisma = getPrismaServer();

			// Use email as ID if provider doesn't give us a stable ID
			const userId = user.id || user.email;

			// Find or create user profile
			await prisma.profile.upsert({
				where: { id: userId },
				update: {
					email: user.email,
					display_name: user.name || null,
					image_url: user.image || null,
					provider: account.provider,
				},
				create: {
					id: userId,
					email: user.email,
					display_name: user.name || null,
					image_url: user.image || null,
					provider: account.provider,
					quest_counts: 0,
					enable_custom_quest: false,
				},
			});

			// Update user.id to use our database ID
			user.id = userId;

			return true;
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},
	pages: {
		signIn: "/auth",
	},
	session: {
		strategy: "jwt",
	},
};

