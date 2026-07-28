"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "./prisma";

export const shareAction = async (formData: FormData) => {
	const file = formData.get("file") as File;
	const desc = formData.get("desc") as File;

	console.log(file, desc);
};

export const followUser = async (targetUserId: string) => {
	const { userId } = await auth();

	if (!userId) return;

	const existingFollow = await prisma.follow.findFirst({
		where: {
			followerId: userId,
			followingId: targetUserId,
		},
	});

	if (existingFollow) {
		await prisma.follow.delete({
			where: { id: existingFollow.id },
		});
	} else {
		await prisma.follow.create({
			data: { followerId: userId, followingId: targetUserId },
		});
	}
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

export const rePost = async (postId: number) => {
	const { userId } = await auth();

	if (!userId) return;

	const existingRepost = await prisma.post.findFirst({
		where: {
			userId: userId,
			rePostId: postId,
		},
	});

	if (existingRepost) {
		await prisma.post.delete({
			where: { id: existingRepost.id },
		});
	} else {
		await prisma.post.create({
			data: { userId, rePostId: postId },
		});
	}
};

export const savePost = async (postId: number) => {
	const { userId } = await auth();

	if (!userId) return;

	const existingSavedPost = await prisma.savedPosts.findFirst({
		where: {
			userId: userId,
			postId: postId,
		},
	});

	if (existingSavedPost) {
		await prisma.savedPosts.delete({
			where: { id: existingSavedPost.id },
		});
	} else {
		await prisma.savedPosts.create({
			data: { userId, postId },
		});
	}
};

export const addComment = async (
	prevState: { success: boolean; error: boolean },
	formData: FormData,
) => {
	const { userId } = await auth();

	if (!userId) return { success: false, error: true };

	const username = formData.get("username");
	const postId = formData.get("postId");
	const desc = formData.get("desc");

	const Comment = z.object({
		parentPostId: z.number(),
		desc: z.string().max(140),
	});

	const validatedFields = Comment.safeParse({
		parentPostId: Number(postId),
		desc,
	});

	if (!validatedFields.success) {
		return { success: false, error: true };
	}

	try {
		await prisma.post.create({
			data: {
				...validatedFields.data,
				userId,
			},
		});

		revalidatePath(`/${username}/status/${postId}`);

		return { success: true, error: false };
	} catch (error) {
		console.log(error);
		return { success: false, error: true };
	}
};

export const addPost = async (
	prevState: { success: boolean; error: boolean },
	formData: FormData,
) => {
	const PostSchema = z.object({
		desc: z.string().max(140),
		isSensitive: z.boolean().optional(),
		img: z.string().optional(),
		imgHeight: z.number().optional(),
		video: z.string().optional(),
	});

	const { userId } = await auth();

	if (!userId) return { success: false, error: true };

	const desc = formData.get("desc") as string;
	const isSensitiveRaw = formData.get("isSensitive") as string;
	const img = (formData.get("img") as string) || "";
	const imgHeight = Number(formData.get("imgHeight")) || 0;
	const video = (formData.get("video") as string) || "";
	const imgType = formData.get("imgType");

	const validatedFields = PostSchema.safeParse({
		desc,
		isSensitive: isSensitiveRaw === "true",
		img,
		imgHeight,
		video,
	});

	if (!validatedFields.success) {
		return { success: false, error: true };
	}

	try {
		await prisma.post.create({
			data: {
				...validatedFields.data,
				userId,
			},
		});

		revalidatePath("/");
		return { success: true, error: false };
	} catch (error) {
		console.error("Prisma error:", error);
		return { success: false, error: true };
	}
};
