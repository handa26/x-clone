import ImageKit from "@imagekit/nodejs";

export const imageKitClient = new ImageKit({
	privateKey: process.env.IMAGEKIT_SECRET_KEY,
});
