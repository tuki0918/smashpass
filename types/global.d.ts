interface PublicRuntimeConfig {
	SITE_NAME: string | undefined;
	SITE_DESCRIPTION: string | undefined;
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
