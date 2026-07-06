"use client";

import { useState, useRef } from "react";
import {
	Image,
	ImageKitAbortError,
	ImageKitInvalidRequestError,
	ImageKitServerError,
	ImageKitUploadNetworkError,
	upload,
} from "@imagekit/next";
import NextImage from "next/image";

import ImageEditor from "./ImageEditor";

import { shareAction } from "@/actions";

const Share = () => {
	const [media, setMedia] = useState<File | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [settings, setSettings] = useState<{
		type: "original" | "wide" | "square";
		sensitive: boolean;
	}>({
		type: "original",
		sensitive: false,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

	const abortController = new AbortController();

	const authenticator = async () => {
		try {
			// Perform the request to the upload authentication endpoint.
			const response = await fetch("/api/upload-auth");
			if (!response.ok) {
				// If the server response is not successful, extract the error text for debugging.
				const errorText = await response.text();
				throw new Error(
					`Request failed with status ${response.status}: ${errorText}`,
				);
			}

			// Parse and destructure the response JSON for upload credentials.
			const data = await response.json();
			const { signature, expire, token, publicKey } = data;
			return { signature, expire, token, publicKey };
		} catch (error) {
			// Log the original error for debugging before rethrowing a new error.
			console.error("Authentication error:", error);
			throw new Error("Authentication request failed");
		}
	};

	const handleSubmit = async () => {
		// Access the file input element using the ref
		const fileInput = fileInputRef.current;
		if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
			alert("Please select a file to upload");
			return;
		}

		// Extract the first file from the file input
		const file = fileInput.files[0];

		// Retrieve authentication parameters for the upload.
		let authParams;
		try {
			authParams = await authenticator();
		} catch (authError) {
			console.error("Failed to authenticate for upload:", authError);
			return;
		}
		const { signature, expire, token, publicKey } = authParams;

		const transformation = `w-600 ${settings.type === "square" ? "ar-1-1" : settings.type === "wide" ? "ar-16-9" : ""}`;

		// Call the ImageKit SDK upload function with the required parameters and callbacks.
		try {
			const uploadResponse = await upload({
				// Authentication parameters
				expire,
				token,
				signature,
				publicKey,
				file,
				fileName: file.name, // Optionally set a custom file name
				// Abort signal to allow cancellation of the upload if needed.
				abortSignal: abortController.signal,
				...(file.type.includes("image") && {
					transformation: {
						pre: transformation,
					},
				}),
				customMetadata: {
					sensitive: settings.sensitive,
				},
				folder: "/posts",
			});
			console.log("Upload response:", uploadResponse);
		} catch (error) {
			// Handle specific error types provided by the ImageKit SDK.
			if (error instanceof ImageKitAbortError) {
				console.error("Upload aborted:", error.reason);
			} else if (error instanceof ImageKitInvalidRequestError) {
				console.error("Invalid request:", error.message);
			} else if (error instanceof ImageKitUploadNetworkError) {
				console.error("Network error:", error.message);
			} else if (error instanceof ImageKitServerError) {
				console.error("Server error:", error.message);
			} else {
				// Handle any other errors that may occur.
				console.error("Upload error:", error);
			}
		}
	};

	const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setMedia(e.target.files[0]);
		}
	};

	const previewUrl = media ? URL.createObjectURL(media) : null;

	return (
		<form className="p-4 flex gap-4" action={handleSubmit}>
			{/* AVATAR */}
			<div className="relative w-10 h-10 rounded-full overflow-hidden">
				<Image src="general/avatar.png" alt="" width={100} height={100} />
			</div>

			{/* OTHERS */}
			<div className="flex-1 flex flex-col gap-4">
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
							className={`w-full ${settings.type === "original" ? "h-full object-contain" : settings.type === "square" ? "aspect-square object-cover" : "aspect-video object-cover"}`}
						/>
						<div
							className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer"
							onClick={() => setIsEditorOpen(true)}
						>
							Edit
						</div>
						<div
							className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
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
							className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
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
							onChange={handleMediaChange}
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
					<button className="bg-white text-black font-bold rounded-full py-2 px-4">
						Post
					</button>
				</div>
			</div>
		</form>
	);
};

export default Share;
