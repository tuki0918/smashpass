/** @type {import('next').NextConfig} */
const nextConfig = {
	publicRuntimeConfig: {
		SITE_NAME: "123++",
		SITE_DESCRIPTION: "",
		DB_FIRESTORE_SMASH_COLLECTION_NAME: "smash-view-counters",
	},
	// Please prefix with “SECRET_”
	serverRuntimeConfig: {},
};

export default nextConfig;
