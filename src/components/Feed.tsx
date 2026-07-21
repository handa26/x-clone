import { auth } from "@clerk/nextjs/server";

import Post from "./Post";
import InfiniteFeed from "./InfiniteFeed";

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

	const posts = await prisma.post.findMany({
		where: whereCondition,
		include: {
			user: { select: { displayName: true, username: true, img: true } },
			rePost: {
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
		take: 3,
		skip: 0,
		orderBy: {
			createdAt: "desc",
		},
	});

	// const followings = await prisma.follow.findMany({
	// 	where: { followerId: userId },
	// 	select: { followingId: true },
	// });

	return (
		<div className="">
			{posts.map((post) => (
				<div className="" key={post.id}>
					<Post post={post} />
				</div>
			))}

			<InfiniteFeed />
		</div>
	);
};

export default Feed;
