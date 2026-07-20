import { Image, Video } from "@imagekit/next";
import Link from "next/link";

import { imageKitClient } from "@/utils";

import PostInfo from "./PostInfo";
import PostInteractions from "./PostInteractions";

interface FileDetailsResponse {
	width: number;
	height: number;
	filePath: string;
	url: string;
	fileType: string;
	customMetadata?: {
		sensitive: boolean;
	};
}

const Post = ({ type }: { type?: "status" | "comment" }) => {
	// const getFileDetails = async (
	// 	fileId: string,
	// ): Promise<FileDetailsResponse> => {
	// 	try {
	// 		const result = await imageKitClient.files.get(fileId);

	// 		return result;
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// };

	// const fileDetails = await getFileDetails("6a4b44ab5c7cd75eb8bf25d0");

	return (
		<div className="p-4 border-y-[1px] border-borderGray">
			{/* POST TYPE */}
			<div className="flex items-center gap-2 text-sm text-textGray mb-2 font-bold">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
				>
					<path
						fill="#71767b"
						d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
					/>
				</svg>
				<span>Handa retweeted</span>
			</div>

			{/* POST CONTENT */}
			<div className={`flex gap-4 ${type === "status" && "flex-col"}`}>
				{/* AVATAR */}
				<div
					className={`${type === "status" && "hidden"} relative w-10 h-10 rounded-full overflow-hidden`}
				>
					<Image src="general/avatar.png" alt="" width={100} height={100} />
				</div>

				{/* CONTENT */}
				<div className="flex-1 flex flex-col gap-2">
					{/* TOP */}
					<div className="w-full flex justify-between">
						<Link href={`/handa26`} className="flex gap-4">
							<div
								className={`${type !== "status" && "hidden"} relative w-10 h-10 rounded-full overflow-hidden`}
							>
								<Image
									src="general/avatar.png"
									alt=""
									width={100}
									height={100}
								/>
							</div>
							<div
								className={`flex items-center gap-2 flex-wrap ${type === "status" && "flex-col gap-0 !items-start"}`}
							>
								<h1 className="text-md font-bold">Handa</h1>
								<span
									className={`text-textGray ${type === "status" && "text-sm"}`}
								>
									@handa26
								</span>
								{type !== "status" && (
									<span className="text-textGray">1 day ago</span>
								)}
							</div>
						</Link>

						<PostInfo />
					</div>

					{/* TEXT/MEDIA */}
					<Link href={`/handa26/status/123`}>
						<p className={`${type === "status" && "text-lg"}`}>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla ab
							nesciunt doloribus. Nam facilis est odio architecto voluptatum.
							Libero hic sapiente exercitationem provident in iure, minus sunt
							ipsam pariatur recusandae?
						</p>
					</Link>

					{/* {fileDetails && fileDetails.fileType === "image" ? (
						<Image
							src={fileDetails.filePath}
							alt=""
							width={fileDetails.width}
							height={fileDetails.height}
							className={fileDetails.customMetadata?.sensitive ? "blur-lg" : ""}
						/>
					) : (
						<Video
							src={fileDetails.filePath}
							transformation={[{ width: "1920", height: "1080", q: "90" }]}
							className={fileDetails.customMetadata?.sensitive ? "blur-lg" : ""}
							controls
						/>
					)} */}

					{type === "status" && <span className="text-textGray">2:29 am · 14 May 2026</span>}

					<PostInteractions />
				</div>
			</div>
		</div>
	);
};

export default Post;
