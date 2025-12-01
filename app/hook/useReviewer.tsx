"use client";

import { useQuery } from "@tanstack/react-query";
import { getChallenger } from "@/actions/db";

export default function useReviewer(userId: string) {
	return useQuery({
		queryKey: ["reviewer"],
		queryFn: async () => {
			const challenger = await getChallenger(userId);
			if (!challenger) return null;
			return {
				...challenger,
				created_at: challenger.created_at.toISOString(),
				profiles: challenger.reviewer,
			};
		},
		enabled: !!userId,
	});
}
