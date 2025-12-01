import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
				protocol: "https",
			},
			{
				hostname: "lh3.googleusercontent.com",
				protocol: "https",
			},
		],
	},
};
const isDev = process.env.NODE_ENV !== "production";

const withPWA = nextPwa({
	dest: "public",
	register: true,
	buildExcludes: [
		/app-build-manifest\.json$/,
		/middleware-manifest\.json$/,
		/build-manifest\.json$/
	],
});

const config = withPWA({
	...nextConfig,
});

export default config;
