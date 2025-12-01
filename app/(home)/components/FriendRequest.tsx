import useFriendRequest from "@/app/hook/useFriendRequest";
import useUser from "@/app/hook/useUser";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { deleteChallenger, updateChallenger } from "@/actions/db";
import { toast } from "sonner";
import AddFriendForm from "./AddFriendForm";
import usePendingRequest from "@/app/hook/useReviewer";

export default function FriendRequest() {
	const { data: user } = useUser();

	const handleCopyUserId = async () => {
		await navigator.clipboard.writeText(user?.id || "");
		toast.success("id is copied. Use it to share with your friend.");
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">🧔 Friend </h1>
				<Button
					className=" rounded-xl"
					variant="outline"
					onClick={handleCopyUserId}
				>
					Copy your ID
				</Button>
			</div>
			<Request />
			<Pending />
			<AddFriendForm />
		</>
	);
}

const Request = () => {
	const { data: user } = useUser();
	const { data: request } = useFriendRequest(user?.id || "");

	const handleRemoveChallenger = async () => {
		try {
			if (request?.user_id) {
				await deleteChallenger(request.user_id);
				toast.success(
					"Successfully remove challenger. Please add a new challenger to complete your quest"
				);
			}
		} catch (error) {
			toast.error("Failed to remove challenger. " + (error instanceof Error ? error.message : "Unknown error"));
		}
	};

	const handleAccepte = async () => {
		try {
			await updateChallenger(user?.id!, { is_accepted: true });
			toast.success("Friend request accepted!");
		} catch (error) {
			toast.error("Failed to accept request. " + (error instanceof Error ? error.message : "Unknown error"));
		}
	};

	if (request) {
		return (
			<div className="bg-zinc-900 p-5 rounded-xl flex items-center justify-between">
				<div className="flex items-center gap-2 ">
					<Image
						src={request?.profiles?.image_url!}
						alt="sokheng"
						width={50}
						height={50}
						className=" rounded-full ring-1"
					/>
					<h1 className="text-lg">
						{request?.profiles?.display_name}
					</h1>
				</div>
				<div className="space-x-2">
					{!request.is_accepted && (
						<Button
							variant="outline"
							className=" rounded-xl"
							onClick={handleRemoveChallenger}
						>
							delete ❌
						</Button>
					)}

					<Button className=" rounded-xl" onClick={handleAccepte}>
						confirm ✅
					</Button>
				</div>
			</div>
		);
	}
	return <></>;
};

const Pending = () => {
	const { data: user } = useUser();
	const { data } = usePendingRequest(user?.id || "");

	const handleRemoveChallenger = async () => {
		try {
			await deleteChallenger(user?.id!);
			toast.success(
				"Successfully remove challenger. Please add a new challenger to complete your quest"
			);
		} catch (error) {
			toast.error("Failed to remove challenger. " + (error instanceof Error ? error.message : "Unknown error"));
		}
	};

	if (data) {
		return (
			<div className="bg-zinc-900 p-5 rounded-xl flex items-center justify-between">
				<div className="flex items-center gap-2 ">
					<Image
						src={data?.profiles?.image_url!}
						alt="sokheng"
						width={50}
						height={50}
						className=" rounded-full ring-1"
					/>
					<h1 className="text-lg">{data?.profiles?.display_name}</h1>
				</div>
				<div className="space-x-2">
					{!data.is_accepted && (
						<Button variant="outline" className=" rounded-xl">
							Pending⌛️
						</Button>
					)}

					<Button
						className=" rounded-xl"
						onClick={handleRemoveChallenger}
					>
						Remove ❌
					</Button>
				</div>
			</div>
		);
	}
	return <></>;
};
