"use server";

import { auth } from "@clerk/nextjs/server";

import { prisma } from "./prisma";

export const shareAction = async (formData: FormData) => {
	const file = formData.get("file") as File;
	const desc = formData.get("desc") as File;

  console.log(file, desc);
};

export const likePost = async (postId: number) => {
	const { userId } = await auth();

	if (!userId) return;

	const existingLike = await prisma.like.findFirst({
		where: {
			userId: userId,
			postId: postId,
		},
	});

	if (existingLike) {
		await prisma.like.delete({
			where: { id: existingLike.id },
		});
	} else {
		await prisma.like.create({
			data: { userId, postId },
		});
	}
};
