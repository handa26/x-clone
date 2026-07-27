"use client";

import { useState } from "react";
import { Image } from "@imagekit/next";

interface PostImageProps {
	src: string;
	height?: number;
	isSensitive?: boolean;
}

export const PostImage = ({
	src,
	height = 600,
	isSensitive = false,
}: PostImageProps) => {
	const [isSensitiveShown, setIsSensitiveShown] = useState(false);

	const isHidden = isSensitive && !isSensitiveShown;

	return (
		<div className="relative rounded-2xl overflow-hidden border border-[#2f3336] my-3">
			{/* 1. Image Container */}
			<Image
				src={src}
				alt="Post media"
				width={600}
				height={height}
				className={`w-full object-cover transition-all duration-300 ${
					isHidden ? "blur-2xl scale-105 select-none pointer-events-none" : ""
				}`}
			/>

			{/* 2. Sensitive Content Overlay (Rendered when hidden) */}
			{isHidden && (
				<div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10 gap-3">
					<div className="flex items-center gap-2 text-white font-semibold text-sm md:text-base">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
							<circle cx="12" cy="12" r="3" />
							<line x1="2" x2="22" y1="2" y2="22" />
						</svg>
						<span>The following media includes sensitive content</span>
					</div>

					<p className="text-[#71767b] text-xs max-w-sm">
						The post author marked this media as containing sensitive content.
					</p>

					<button
						onClick={() => setIsSensitiveShown(true)}
						className="mt-1 bg-white hover:bg-neutral-200 text-black font-bold text-sm py-1.5 px-4 rounded-full transition-colors"
					>
						Show
					</button>
				</div>
			)}

			{/* 3. Optional "Hide" button to re-blur once revealed */}
			{isSensitive && isSensitiveShown && (
				<button
					onClick={() => setIsSensitiveShown(false)}
					className="absolute top-2 left-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors z-10"
					title="Hide sensitive content"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
						<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
						<path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
						<line x1="2" x2="22" y1="2" y2="22" />
					</svg>
				</button>
			)}
		</div>
	);
};
