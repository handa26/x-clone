import Link from "next/link";
import { Image } from "@imagekit/next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import Feed from "@/components/Feed";
import FollowButton from "@/components/FollowButton";

import { prisma } from "@/prisma";

interface PageProps {
	params: Promise<{ username: string }>;
}

const UserPage = async ({ params }: PageProps) => {
	const { userId } = await auth();

	const user = await prisma.user.findUnique({
		where: { username: (await params).username },
		include: {
			_count: { select: { followers: true, followings: true } },
			followings: userId ? { where: { followerId: userId } } : undefined,
		},
	});

	if (!user) notFound();

	return (
		<div className="">
			{/* PROFILE TITLE */}
			<div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
				<Link href="/">
					<Image src="icons/back.svg" alt="back-icon" width={24} height={24} />
				</Link>
				<h1 className="font-bold text-lg">{user.displayName}</h1>
			</div>

			{/* INFO */}
			<div className="">
				{/* COVER & AVATAR CONTAINER */}
				<div className="relative w-full">
					{/* COVER */}
					<div className="w-full aspect-[3/1] relative">
						<Image
							src={user.cover || "general/cover.jpg"}
							alt=""
							width={600}
							height={200}
							transformation={[{ width: 600, height: 200 }]}
						/>
					</div>

					{/* AVATAR */}
					<div className="w-1/5 aspect-square rounded-full flex justify-center align-middle overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
						<Image
							src={user.img || "general/noAvatar.png"}
							alt=""
							width={100}
							height={100}
							transformation={[{ width: 100, height: 100 }]}
						/>
					</div>
				</div>

				{/* CTA */}
				<div className="flex w-full items-center justify-end gap-2 p-2">
					<div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
						<Image src="icons/more.svg" alt="" width={20} height={20} />
					</div>
					<div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
						<Image src="icons/explore.svg" alt="" width={20} height={20} />
					</div>
					<div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
						<Image src="icons/message.svg" alt="" width={20} height={20} />
					</div>

					{userId && (
						<FollowButton
							userId={user.id}
							isFollowed={!!user.followings.length}
						/>
					)}
				</div>

				{/* USER INFO */}
				<div className="p-4 flex flex-col gap-2">
					{/* USERNAME & HANDLE */}
					<div className="">
						<h1 className="text-2xl font-bold">{user.displayName}</h1>
						<span className="text-textGray text-sm">@{user.username}</span>
					</div>
					{user.bio && <p>{user.bio}</p>}
					{/* JOB & LOCATION & DATE */}
					<div className="flex gap-4 text-textGray text-[15px]">
						{user.location && (
							<div className="flex items-center gap-2">
								<Image
									src="icons/userLocation.svg"
									alt="location"
									width={20}
									height={20}
								/>
								<span>{user.location}</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<Image src="icons/date.svg" alt="date" width={20} height={20} />
							<span>
								Joined{" "}
								{new Date(user.createdAt.toString()).toLocaleDateString(
									"en-US",
									{ month: "long", year: "numeric" },
								)}
							</span>
						</div>
					</div>

					{/* FOLLOWINGS & FOLLOWERS */}
					<div className="flex gap-4">
						<div className="flex items-center gap-2">
							<span className="font-bold">{user._count.followers}</span>
							<span className="text-textGray text-[15px]">Followers</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-bold">{user._count.followings}</span>
							<span className="text-textGray text-[15px]">Followings</span>
						</div>
					</div>
				</div>
			</div>

			{/* FEED */}
			<Feed userProfileId={user?.id} />
		</div>
	);
};

export default UserPage;
