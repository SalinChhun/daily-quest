import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const path = formData.get("path") as string;

		if (!file || !path) {
			return NextResponse.json(
				{ error: "Missing file or path" },
				{ status: 400 }
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Save to public/uploads directory
		const uploadDir = join(process.cwd(), "public", "uploads");
		const filePath = join(uploadDir, path);

		// Create directory if it doesn't exist
		const dirPath = join(uploadDir, path.split("/").slice(0, -1).join("/"));
		if (!existsSync(dirPath)) {
			await mkdir(dirPath, { recursive: true });
		}

		await writeFile(filePath, buffer);

		return NextResponse.json({ path: `/uploads/${path}` });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 }
		);
	}
}

