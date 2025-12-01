"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuestLog } from "@/actions/db";

export default function useQuestLog() {
	return useQuery({
		queryKey: ["quest-log"],
		queryFn: async () => {
			const log = await getQuestLog();
			if (!log) return null;
			return {
				...log,
				log_date: log.log_date.toISOString(),
			};
		},
	});
}
