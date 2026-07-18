"use client";

import { useSignIn } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/nextjs/types";

const SignInPage = () => {
	const { signIn, errors } = useSignIn();

	const signInWith = async (strategy: OAuthStrategy) => {
		const { error } = await signIn.sso({
			strategy,
			redirectCallbackUrl: "/sso-callback",
			redirectUrl: "/",
		});

		if (error) {
			console.error(JSON.stringify(error, null, 2));
		}
	};

	return (
		<div className="h-screen flex items-center justify-between p-8">
			<div className="hidden lg:flex w-1/2 items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="320"
					height="320"
					viewBox="0 0 24 24"
				>
					<path
						fill="white"
						d="M 26.609375 29.023438 L 3.425781 29.023438 L 3.425781 26.707031 L 24.3125 26.707031 L 24.3125 23.242188 L 3.390625 23.242188 L 3.441406 0.015625 L 11.46875 0.015625 L 11.46875 17.117188 L 9.167969 17.117188 L 9.167969 2.335938 L 5.738281 2.335938 L 5.695312 20.925781 L 26.609375 20.925781 L 26.609375 29.023438"
					/>
				</svg>
			</div>

			<div className="w-full lg:w-1/2 flex flex-col gap-4">
				<h1 className="text-2xl xsm:text-4xl md:text-6xl font-bold">
					Happening now
				</h1>
				<h2 className="text-2xl">Join today.</h2>

				<button
					onClick={() => signInWith("oauth_google")}
					className="bg-white rounded-full p-2 text-black w-72 flex items-center justify-center gap-2 font-bold"
				>
					<svg viewBox="0 0 24 24" width={24} height={24}>
						<path
							d="M18.977 4.322L16 7.3c-1.023-.838-2.326-1.35-3.768-1.35-2.69 0-4.95 1.73-5.74 4.152l-3.44-2.635c1.656-3.387 5.134-5.705 9.18-5.705 2.605 0 4.93.977 6.745 2.56z"
							fill="#EA4335"
						/>
						<path
							d="M6.186 12c0 .66.102 1.293.307 1.89L3.05 16.533C2.38 15.17 2 13.63 2 12s.38-3.173 1.05-4.533l3.443 2.635c-.204.595-.307 1.238-.307 1.898z"
							fill="#FBBC05"
						/>
						<path
							d="M18.893 19.688c-1.786 1.667-4.168 2.55-6.66 2.55-4.048 0-7.526-2.317-9.18-5.705l3.44-2.635c.79 2.42 3.05 4.152 5.74 4.152 1.32 0 2.474-.308 3.395-.895l3.265 2.533z"
							fill="#34A853"
						/>
						<path
							d="M22 12c0 3.34-1.22 5.948-3.107 7.688l-3.265-2.53c1.07-.67 1.814-1.713 2.093-3.063h-5.488V10.14h9.535c.14.603.233 1.255.233 1.86z"
							fill="#4285F4"
						/>
					</svg>
					Sign in with Google
				</button>

				<button
					onClick={() => signInWith("oauth_github")}
					className="bg-black border border-white rounded-full p-2 text-white w-72 flex items-center justify-center gap-2 font-bold"
				>
					<svg viewBox="0 0 24 24" width={20} height={20} fill="white">
						<path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.071 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.221-.253-4.556-1.113-4.556-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026a9.564 9.564 0 0 1 2.504-.337c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.679.919.679 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
					</svg>
					Sign in with GitHub
				</button>

				{/* LOGIN WITH CREDENTIALS */}
			</div>
		</div>
	);
};

export default SignInPage;
