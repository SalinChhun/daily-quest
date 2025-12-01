"use server";
import { getPrismaServer } from "@/lib/prisma/server";
import webpush from "web-push";

export const sendNotification = async (
	message: string,
	user_id: string,
	icon: string,
	name: string
) => {
	const vapidKeys = {
		publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
		privateKey: process.env.VAPID_PRIVATE_KEY!,
	};
	//setting our previously generated VAPID keys
	webpush.setVapidDetails(
		"mailto:myuserid@email.com",
		vapidKeys.publicKey,
		vapidKeys.privateKey
	);

	const prisma = getPrismaServer();
	const notification = await prisma.notification.findUnique({
		where: { user_id: user_id },
	});
	
	if (!notification) {
		return JSON.stringify({ error: "Notification not found" });
	}
	
	const data = notification;
	if (data) {
		try {
			await webpush.sendNotification(
				JSON.parse(data.notification_json),
				JSON.stringify({
					message: name,
					icon,
					body: message,
				})
			);
			return "{}";
		} catch (e) {
			return JSON.stringify({ error: "failed to send notification" });
		}
	}
	return "{}";
};
