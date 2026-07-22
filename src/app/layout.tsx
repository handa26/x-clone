import { ImageKitProvider } from "@imagekit/next";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";

import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
	title: "Twitter/X",
	description:
		"Welcome to Twitter/X, your trusted digital town square, where conversations unfold in real time, get the full story with all the live commentary.",
};

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryProvider>
			<html lang="en">
				<body>
					<ClerkProvider>
						<ImageKitProvider urlEndpoint="https://ik.imagekit.io/handa26">
							{children}
						</ImageKitProvider>
					</ClerkProvider>
				</body>
			</html>
		</QueryProvider>
	);
}
