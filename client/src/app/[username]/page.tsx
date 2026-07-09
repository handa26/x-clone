import Link from "next/link";
import { Image } from "@imagekit/next";

import Feed from "@/components/Feed";

const UserPage = () => {
	return (
		<div className="">
			{/* PROFILE TITLE */}
			<div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
				<Link href="/">
					<Image src="icons/back.svg" alt="back-icon" width={24} height={24} />
				</Link>
				<h1 className="font-bold text-lg">Handa</h1>
			</div>

			{/* INFO */}
			<div className="">
				{/* COVER & AVATAR CONTAINER */}
				<div className="relative w-full">
					{/* COVER */}
					<div className="w-full aspect-[3/1] relative">
						<Image
							src="general/cover.jpg"
							alt=""
							width={600}
							height={200}
							transformation={[{ width: 600, height: 200 }]}
						/>
					</div>

					{/* AVATAR */}
					<div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
						<Image
							src="general/avatar.png"
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

					<button className="py-2 px-4 bg-white text-black font-bold rounded-full">
						Follow
					</button>
				</div>

				{/* USER INFO */}
				<div className="p-4 flex flex-col gap-2">
					{/* USERNAME & HANDLE */}
					<div className="">
						<h1 className="text-2xl font-bold">Handa</h1>
						<span className="text-textGray text-sm">@handa26</span>
					</div>
					<p>Handa Youtube Channel</p>
					{/* JOB & LOCATION & DATE */}
					<div className="flex gap-4 text-textGray text-[15px]">
						<div className="flex items-center gap-2">
							<Image
								src="icons/userLocation.svg"
								alt="location"
								width={20}
								height={20}
							/>
							<span>Indonesia</span>
						</div>
            <div className="flex items-center gap-2">
							<Image
								src="icons/date.svg"
								alt="date"
								width={20}
								height={20}
							/>
							<span>Joined July 2026</span>
						</div>
					</div>

          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
				</div>
			</div>

      {/* FEED */}
      <Feed />
		</div>
	);
};

export default UserPage;
