"use server";

import { getPrismaServer } from "@/lib/prisma/server";
import { getSession } from "@/lib/auth/session";

// Helper to get current user ID
async function getCurrentUserId() {
	return await getSession();
}

// Profile operations
export async function getProfile(userId: string) {
	const prisma = getPrismaServer();
	return await prisma.profile.findUnique({
		where: { id: userId },
		include: {
			strike: true,
			challengerAsUser: {
				select: {
					reviewer_id: true,
				},
			},
			notifications: {
				select: {
					user_id: true,
				},
				take: 1,
			},
		},
	});
}

export async function getCurrentUserProfile() {
	const userId = await getCurrentUserId();
	if (!userId) return null;
	return await getProfile(userId);
}

// Quest operations
export async function getQuests(userId: string) {
	const prisma = getPrismaServer();
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	return await prisma.quest.findMany({
		where: {
			created_by: userId,
			public: false,
		},
		include: {
			questProgress: {
				where: {
					user_id: userId,
					created_at: {
						gte: currentDate,
					},
				},
			},
		},
	});
}

export async function createQuest(data: { title: string; emoji: string; public?: boolean }) {
	const prisma = getPrismaServer();
	const userId = await getCurrentUserId();
	if (!userId) throw new Error("Not authenticated");

	return await prisma.quest.create({
		data: {
			title: data.title,
			emoji: data.emoji,
			public: data.public ?? false,
			created_by: userId,
		},
	});
}

// Quest Log operations
export async function getQuestLog(userId?: string) {
	const prisma = getPrismaServer();
	const currentUserId = userId || await getCurrentUserId();
	if (!currentUserId) return null;

	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	return await prisma.questLog.findFirst({
		where: {
			user_id: currentUserId,
			log_date: {
				gte: currentDate,
			},
		},
	});
}

// Challenger operations
export async function getChallenger(userId: string) {
	const prisma = getPrismaServer();
	return await prisma.challenger.findUnique({
		where: {
			user_id: userId,
		},
		include: {
			reviewer: {
				select: {
					display_name: true,
					image_url: true,
				},
			},
		},
	});
}

export async function getChallengerByReviewer(reviewerId: string) {
	const prisma = getPrismaServer();
	return await prisma.challenger.findFirst({
		where: {
			reviewer_id: reviewerId,
			is_accepted: false,
		},
		include: {
			user: {
				select: {
					display_name: true,
					image_url: true,
				},
			},
		},
	});
}

export async function createChallenger(reviewerId: string) {
	const prisma = getPrismaServer();
	const userId = await getCurrentUserId();
	if (!userId) throw new Error("Not authenticated");

	return await prisma.challenger.create({
		data: {
			user_id: userId,
			reviewer_id: reviewerId,
		},
	});
}

export async function deleteChallenger(userId: string) {
	const prisma = getPrismaServer();
	return await prisma.challenger.delete({
		where: {
			user_id: userId,
		},
	});
}

export async function updateChallenger(reviewerId: string, data: { is_accepted?: boolean }) {
	const prisma = getPrismaServer();
	const challenger = await prisma.challenger.findFirst({
		where: {
			reviewer_id: reviewerId,
		},
	});
	if (!challenger) throw new Error("Challenger not found");
	
	return await prisma.challenger.update({
		where: {
			user_id: challenger.user_id,
		},
		data,
	});
}

// Quest Progress operations
export async function getChallengerQuests(reviewerId: string) {
	const prisma = getPrismaServer();
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	return await prisma.questProgress.findMany({
		where: {
			user_id: reviewerId,
			created_at: {
				gte: currentDate,
			},
			is_completed: false,
		},
		include: {
			quest: true,
			user: {
				select: {
					display_name: true,
				},
			},
		},
	});
}

export async function createQuestProgress(data: {
	quest_id: string;
	object_id: string;
	image_url: string;
}) {
	const prisma = getPrismaServer();
	const userId = await getCurrentUserId();
	if (!userId) throw new Error("Not authenticated");

	return await prisma.questProgress.create({
		data: {
			quest_id: data.quest_id,
			user_id: userId,
			object_id: data.object_id,
			image_url: data.image_url,
		},
	});
}

// Helper function to create quest progress after file upload
export async function createQuestProgressAfterUpload(
	questId: string,
	objectId: string,
	imageUrl: string
) {
	return await createQuestProgress({
		quest_id: questId,
		object_id: objectId,
		image_url: imageUrl,
	});
}

export async function updateQuestProgress(id: string, data: { is_completed?: boolean }) {
	const prisma = getPrismaServer();
	return await prisma.questProgress.update({
		where: { id },
		data,
	});
}

// Notification operations
export async function getNotification(userId: string) {
	const prisma = getPrismaServer();
	return await prisma.notification.findUnique({
		where: { user_id: userId },
	});
}

