import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
	const { token, expire, signature } = getUploadAuthParams({
		privateKey: process.env.IMAGEKIT_SECRET_KEY as string,
		publicKey: process.env.NEXT_IMAGEKIT_PUBLIC_KEY as string,
	});

	return Response.json({
		token,
		expire,
		signature,
		publicKey: process.env.NEXT_IMAGEKIT_PUBLIC_KEY,
	});
}
