import { Image } from "@imagekit/next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import Post from "@/components/Post";
import Comments from "@/components/Comments";

import { prisma } from "@/prisma";

const StatusPage = async ({
	params,
}: {
	params: Promise<{ username: string; postId: string }>;
}) => {
	const postId = (await params).postId;
	const { userId } = await auth();

	if (!userId) return;

	const post = await prisma.post.findFirst({
		where: { id: Number(postId) },
		include: {
			user: { select: { displayName: true, username: true, img: true } },
			_count: {
				select: {
					likes: true,
					rePosts: true,
					comments: true,
				},
			},
			likes: {
				where: { userId: userId },
				select: { id: true },
			},
			rePosts: {
				where: { userId: userId },
				select: { id: true },
			},
			saves: {
				where: { userId: userId },
				select: { id: true },
			},
			comments: {
				include: {
					user: { select: { displayName: true, username: true, img: true } },
					_count: {
						select: {
							likes: true,
							rePosts: true,
							comments: true,
						},
					},
					likes: {
						where: { userId: userId },
						select: { id: true },
					},
					rePosts: {
						where: { userId: userId },
						select: { id: true },
					},
					saves: {
						where: { userId: userId },
						select: { id: true },
					},
				},
			},
		},
	});

	if (!post) return notFound();

	return (
		<div className="">
			{/* PROFILE TITLE */}
			<div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
				<Link href="/">
					<Image src="icons/back.svg" alt="back-icon" width={24} height={24} />
				</Link>
				<h1 className="font-bold text-lg">Post</h1>
			</div>

			{/* MAIN POST */}
			<Post type="status" post={post} />

			{/* REPLIES */}
			<Comments
				comments={post.comments}
				postId={post.id}
				username={post.user.username}
			/>
		</div>
	);
};

export default StatusPage;
