"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { signIn } from "next-auth/react";

export default function Social({ redirectTo }: { redirectTo: string }) {
	const loginWithProvider = async (provider: "github" | "google") => {
		await signIn(provider, {
			callbackUrl: redirectTo || "/",
		});
	};

	return (
		<div className="w-full flex gap-2">
			<Button
				className="w-full h-10 flex items-center gap-5"
				onClick={() => loginWithProvider("github")}
				variant="outline"
			>
				<IoLogoGithub />
				Github
			</Button>
			<Button
				className="w-full h-10 flex items-center gap-2"
				onClick={() => loginWithProvider("google")}
				variant="outline"
			>
				<FcGoogle />
				Google
			</Button>
		</div>
	);
}
