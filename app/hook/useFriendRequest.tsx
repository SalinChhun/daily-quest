"use client";

import { useQuery } from "@tanstack/react-query";
import { getChallengerByReviewer } from "@/actions/db";

export default function useFriendRequest(userId: string) {
	return useQuery({
		queryKey: ["challenger"],
		queryFn: async () => {
			const challenger = await getChallengerByReviewer(userId);
			if (!challenger) return null;
			return {
				...challenger,
				created_at: challenger.created_at.toISOString(),
				profiles: challenger.user,
			};
		},
		enabled: !!userId,
	});
}
