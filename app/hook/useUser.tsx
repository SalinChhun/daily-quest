"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/actions/db";

export type IUser = {
	created_at: string;
	display_name: string | null;
	email: string;
	id: string;
	image_url: string | null;
	provider: string;
	quest_counts: number;
	enable_custom_quest: boolean;
	notification: {
		user_id: string;
	} | null;
	strike: {
		count: number;
		user_id: string;
	} | null;
	challenger: {
		reviewer_id: string;
	} | null;
} | null;

export default function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const profile = await getCurrentUserProfile();
			if (!profile) return null;
			
			return {
				...profile,
				created_at: profile.created_at.toISOString(),
				notification: profile.notifications[0] || null,
				challenger: profile.challengerAsUser || null,
			} as IUser;
		},
	});
}
