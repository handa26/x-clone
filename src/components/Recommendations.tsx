import Link from "next/link";
import { Image } from "@imagekit/next";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/prisma";

const Recommendations = async () => {
	const { userId } = await auth();

	if (!userId) return;

	const followingIds = await prisma.follow.findMany({
		where: { followerId: userId },
		select: { followingId: true },
	});

	const followedUserIds = followingIds.map((f) => f.followingId);

	const friendRecommendations = await prisma.user.findMany({
		where: {
			id: { not: userId, notIn: followedUserIds },
			followings: { some: { followerId: { in: followedUserIds } } },
		},
		select: { id: true, displayName: true, username: true, img: true },
	});

	return (
		<div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
			{friendRecommendations.map((user) => (
				<div className="flex items-center justify-between" key={user.id}>
					{/* IMAGE AND USER INFO */}
					<div className="flex items-center gap-2">
						<div className="relative rounded-full overflow-hidden w-10 h-10">
							<Image
								src={user.img || "general/noAvatar.png"}
								alt={user.username || ""}
								width={100}
								height={100}
								transformation={[{ width: 100, height: 100 }]}
							/>
						</div>
						<div className="">
							<h1 className="text-md font-bold">
								{user.displayName || user.username}
							</h1>
							<span className="text-textGray text-sm">@{user.username}</span>
						</div>
					</div>

					<button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
						Follow
					</button>
				</div>
			))}

			<Link href="/" className="text-iconBlue">
				See More
			</Link>
		</div>
	);
};

export default Recommendations;
