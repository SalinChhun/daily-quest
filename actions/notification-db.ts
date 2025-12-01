"use server";

import { getPrismaServer } from "@/lib/prisma/server";
import { getSession } from "@/lib/auth/session";

export async function createNotification(notificationJson: string) {
	const prisma = getPrismaServer();
	const userId = await getSession();
	if (!userId) throw new Error("Not authenticated");

	return await prisma.notification.upsert({
		where: { user_id: userId },
		update: { notification_json: notificationJson },
		create: {
			user_id: userId,
			notification_json: notificationJson,
		},
	});
}

export async function deleteNotification() {
	const prisma = getPrismaServer();
	const userId = await getSession();
	if (!userId) throw new Error("Not authenticated");

	return await prisma.notification.delete({
		where: { user_id: userId },
	});
}

