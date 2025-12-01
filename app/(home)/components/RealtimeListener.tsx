"use client";
import useUser from "@/app/hook/useUser";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function RealtimeListener() {
	const queryClient = useQueryClient();
	const { data: user } = useUser();
	const { width, height } = useWindowSize();
	const [isTada, setTada] = useState(false);

	// Polling instead of realtime subscriptions
	useEffect(() => {
		const interval = setInterval(() => {
			queryClient.invalidateQueries({ queryKey: ["reviewer"] });
			queryClient.invalidateQueries({ queryKey: ["challenger"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["challenger-quests"] });
		}, 5000); // Poll every 5 seconds

		return () => clearInterval(interval);
	}, [queryClient]);

	useEffect(() => {
		if (isTada) {
			setTimeout(() => {
				setTada(false);
			}, 5000);
		}
	}, [isTada]);

	if (isTada) {
		return (
			<div className=" fixed top-0">
				<Confetti width={width} height={height} />
			</div>
		);
	}
	return <></>;
}
