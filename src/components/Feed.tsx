import { auth } from "@clerk/nextjs/server";

import Post from "./Post";

import { prisma } from "@/prisma";

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {
	const { userId } = await auth();

	if (!userId) return;

	// FETCH POSTS FROM THE CURRENT USER & THE FOLLOWING USERS
	const whereCondition = userProfileId
		? { parentPostId: null, userId: userProfileId }
		: {
				parentPostId: null,
				userId: {
					in: [
						userId,
						...(
							await prisma.follow.findMany({
								where: { followerId: userId },
								select: { followingId: true },
							})
						).map((follow) => follow.followingId),
					],
				},
			};

	const posts = await prisma.post.findMany({ where: whereCondition });

	// const followings = await prisma.follow.findMany({
	// 	where: { followerId: userId },
	// 	select: { followingId: true },
	// });

	return (
		<div className="">
			{posts.map((post) => (
				<div className="" key={post.id}>
					<Post />
				</div>
			))}
		</div>
	);
};

export default Feed;
