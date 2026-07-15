import { Image } from "@imagekit/next";
import Link from "next/link";

import Post from "@/components/Post";
import Comments from "@/components/Comments";

const StatusPage = () => {
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
      <Post type="status" />

      {/* REPLIES */}
      <Comments />
		</div>
	);
};

export default StatusPage;
