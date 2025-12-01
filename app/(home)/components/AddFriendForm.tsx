import React from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createChallenger } from "@/actions/db";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/app/hook/useUser";
import useFriendRequest from "@/app/hook/useFriendRequest";
import usePendingRequest from "@/app/hook/useReviewer";

const FormSchema = z.object({
	reviewer_id: z.string().uuid(),
});

export default function InputForm() {
	const { data: user } = useUser();
	const { data: request } = useFriendRequest(user?.id || "");
	const { data: pending } = usePendingRequest(user?.id || "");

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			reviewer_id: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			await createChallenger(data.reviewer_id);
			form.reset();
			toast.success("Friend request sent!");
		} catch (error) {
			toast.error(`Failed to add challenger. ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	if (request || pending) {
		return <></>;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6 pt-5 bg-zinc-900 p-5 rounded-xl"
			>
				<FormField
					control={form.control}
					name="reviewer_id"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Enter friend's ID"
									{...field}
									className="text-base"
								/>
							</FormControl>
							<FormDescription>
								{"Ask for your friend's ID or share your own."}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full rounded-xl bg-green-500 text-white hover:bg-green-600"
				>
					Add Friend
				</Button>
			</form>
		</Form>
	);
}
