"use client";

import { useActionState } from "react";
import { Image } from "@imagekit/next";
import { useUser } from "@clerk/nextjs";

import Post from "./Post";

import { Post as PostType } from "@prisma/client";
import { addComment } from "@/actions";

type CommentWithDetails = PostType & {
	user: { displayName: string | null; username: string; img: string | null };
	_count: { likes: number; rePosts: number; comments: number };
	likes: { id: number }[];
	rePosts: { id: number }[];
	saves: { id: number }[];
};

const Comments = ({
	comments,
	postId,
	username,
}: {
	comments: CommentWithDetails[];
	postId: number;
	username: string;
}) => {
	const { isLoaded, isSignedIn, user } = useUser();

	const [state, formAction, isPending] = useActionState(addComment, {
		success: false,
		error: false,
	});

	return (
		<div className="">
			{user && (
				<form
					action={formAction}
					className="flex items-center justify-between gap-4 p-4"
				>
					<div className="relative w-10 h-10 rounded-full overflow-hidden">
						<Image
							src={user?.imageUrl || "general/noAvatar.png"}
							alt=""
							width={100}
							height={100}
							transformation={[{ width: 100, height: 100 }]}
						/>
					</div>
					<input type="string" name="username" value={username} hidden readOnly />
					<input type="number" name="postId" value={postId} hidden readOnly />
					<input
						type="text"
						name="desc"
						className="flex-1 bg-transparent outline-none p-2 text-xl"
						placeholder="Post your reply"
					/>
					<button
						disabled={isPending}
						className="py-2 px-4 font-bold bg-white text-black rounded-full disabled:cursor-not-allowed disabled:bg-slate-200"
					>
						{isPending ? "Replying..." : "Reply"}
					</button>
				</form>
			)}

			{state.error && (
				<span className="text-red-400 p-4">Something went wrong!</span>
			)}

			{/* Replies */}
			{comments.map((comment) => (
				<div key={comment.id}>
					<Post post={comment} type="comment" />
				</div>
			))}
		</div>
	);
};

export default Comments;
