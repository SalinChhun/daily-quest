"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuests } from "@/actions/db";

export default function useQuests(user_id: string) {
	return useQuery({
		queryKey: ["quests"],
		queryFn: async () => {
			return await getQuests(user_id);
		},
		enabled: !!user_id,
	});
}
