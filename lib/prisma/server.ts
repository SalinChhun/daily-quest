import { prisma } from "./client";

export function getPrismaServer() {
	return prisma;
}

