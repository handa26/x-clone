import { ImageKitProvider } from "@imagekit/next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<ClerkProvider>
					<ImageKitProvider urlEndpoint="https://ik.imagekit.io/handa26">
						{children}
					</ImageKitProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
