"use client";

import { useQuery } from "@tanstack/react-query";
import { getChallengerQuests } from "@/actions/db";

export default function useChallengerQuests(reviewer_id: string) {
	return useQuery({
		queryKey: ["challenger-quests"],
		queryFn: async () => {
			const quests = await getChallengerQuests(reviewer_id);
			return quests.map((quest) => ({
				...quest,
				created_at: quest.created_at.toISOString(),
				quests: quest.quest,
				profiles: quest.user,
			}));
		},
		enabled: !!reviewer_id,
	});
}
