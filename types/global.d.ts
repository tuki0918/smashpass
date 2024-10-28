interface PublicRuntimeConfig {
	SITE_NAME: string;
	SITE_DESCRIPTION: string;
	DB_FIRESTORE_SMASH_COLLECTION_NAME: string;
}

// biome-ignore lint/suspicious/noEmptyInterface: empty
interface ServerRuntimeConfig {}

declare module "next/config" {
	declare const getConfig: () => {
		publicRuntimeConfig: PublicRuntimeConfig;
		serverRuntimeConfig: ServerRuntimeConfig;
	};

	export default getConfig;
}
