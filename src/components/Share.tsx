"use client";

import {
	useState,
	useRef,
	useActionState,
	useEffect,
	startTransition,
} from "react";
import {
	Image,
	upload,
} from "@imagekit/next";
import NextImage from "next/image";
import { useUser } from "@clerk/nextjs";

import ImageEditor from "./ImageEditor";

import { addPost } from "@/actions";

const Share = () => {
	const { isLoaded, isSignedIn, user } = useUser();

	const [media, setMedia] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [settings, setSettings] = useState<{
		type: "original" | "wide" | "square";
		sensitive: boolean;
	}>({
		type: "original",
		sensitive: false,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!media) {
			setPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(media);
		setPreviewUrl(url);

		return () => URL.revokeObjectURL(url);
	}, [media]);

	const [state, formAction, isPending] = useActionState(addPost, {
		success: false,
		error: false,
	});

	const authenticator = async () => {
		const response = await fetch("/api/upload-auth");
		if (!response.ok) throw new Error("Authentication request failed");
		return await response.json();
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isUploading || isPending) return;

		// 1. Capture the form element synchronously HERE
		const formElement = e.currentTarget;

		setIsUploading(true);

		let uploadedImg = "";
		let uploadedImgHeight = 0;
		let uploadedVideo = "";

		try {
			// 2. Perform async upload operations
			if (media) {
				const authParams = await authenticator();
				const transformation = `w-600${
					settings.type === "square"
						? ",ar-1-1"
						: settings.type === "wide"
							? ",ar-16-9"
							: ""
				}`;

				const uploadResponse: any = await upload({
					...authParams,
					file: media,
					fileName: media.name,
					...(media.type.includes("image") && {
						transformation: { pre: transformation },
					}),
					customMetadata: { sensitive: settings.sensitive },
					folder: "/posts",
				});

				if (media.type.includes("image")) {
					uploadedImg = uploadResponse.filePath;
					uploadedImgHeight = uploadResponse.height;
				} else {
					uploadedVideo = uploadResponse.filePath;
				}
			}

			// 3. Construct FormData using the pre-captured reference
			const formData = new FormData(formElement);
			formData.set("img", uploadedImg);
			formData.set("imgHeight", uploadedImgHeight.toString());
			formData.set("video", uploadedVideo);
			formData.set("isSensitive", settings.sensitive ? "true" : "false");

			// 4. Trigger Server Action
			startTransition(() => {
				formAction(formData);
			});

			// Reset UI state on success
			setMedia(null);
			formElement.reset(); // Safely reset form input fields
		} catch (err) {
			console.error("Upload failed:", err);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<form className="p-4 flex gap-4" onSubmit={handleFormSubmit}>
			{/* AVATAR */}
			<div className="relative w-10 h-10 rounded-full overflow-hidden">
				<Image
					src={user?.imageUrl || "general/noAvatar.png"}
					alt=""
					width={100}
					height={100}
				/>
			</div>

			{/* OTHERS */}
			<div className="flex-1 flex flex-col gap-4">
				<input type="hidden" name="imgType" value={settings.type} readOnly />
				<input
					type="hidden"
					name="isSensitive"
					value={settings.sensitive ? "true" : "false"}
					readOnly
				/>
				<input
					type="text"
					name="desc"
					placeholder="What is happening?"
					className="bg-transparent outline-none text-xl placeholder:text-textGray"
				/>

				{/* IMAGE PREVIEW */}
				{media?.type.includes("image") && previewUrl && (
					<div className="relative rounded-xl overflow-hidden">
						<NextImage
							src={previewUrl}
							alt=""
							width={600}
							height={600}
							className={`w-full ${
								settings.type === "original"
									? "h-full object-contain"
									: settings.type === "square"
										? "aspect-square object-cover"
										: "aspect-video object-cover"
							}`}
						/>
						<div
							className="absolute top-2 left-2 bg-black/50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer"
							onClick={() => setIsEditorOpen(true)}
						>
							Edit
						</div>
						<div
							className="absolute top-2 right-2 bg-black/50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
							onClick={() => setMedia(null)}
						>
							X
						</div>
					</div>
				)}

				{/* VIDEO PREVIEW */}
				{media?.type.includes("video") && previewUrl && (
					<div className="relative">
						<video src={previewUrl} controls />
						<div
							className="absolute top-2 right-2 bg-black/50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
							onClick={() => setMedia(null)}
						>
							X
						</div>
					</div>
				)}

				{/* IMAGE EDITOR */}
				{isEditorOpen && previewUrl && (
					<ImageEditor
						onClose={() => setIsEditorOpen(false)}
						previewUrl={previewUrl}
						settings={settings}
						setSettings={setSettings}
					/>
				)}

				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="flex gap-4 flex-wrap">
						<input
							type="file"
							name="file"
							onChange={(e) =>
								e.target.files?.[0] && setMedia(e.target.files[0])
							}
							ref={fileInputRef}
							className="hidden"
							id="file"
							accept="image/*,video/*"
						/>
						<label htmlFor="file">
							<Image
								src="icons/image.svg"
								alt=""
								width={20}
								height={20}
								className="cursor-pointer"
							/>
						</label>
						<Image
							src="icons/gif.svg"
							alt=""
							width={20}
							height={20}
							className="cursor-pointer"
						/>
						<Image
							src="icons/poll.svg"
							alt=""
							width={20}
							height={20}
							className="cursor-pointer"
						/>
						<Image
							src="icons/emoji.svg"
							alt=""
							width={20}
							height={20}
							className="cursor-pointer"
						/>
						<Image
							src="icons/schedule.svg"
							alt=""
							width={20}
							height={20}
							className="cursor-pointer"
						/>
						<Image
							src="icons/location.svg"
							alt=""
							width={20}
							height={20}
							className="cursor-pointer"
						/>
					</div>
					<button
						type="submit"
						disabled={isUploading || isPending}
						className="bg-white text-black font-bold rounded-full py-2 px-4 disabled:opacity-50"
					>
						{isUploading ? "Uploading..." : isPending ? "Posting..." : "Post"}
					</button>
				</div>
			</div>
		</form>
	);
};

export default Share;
