import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const {
	SITE_NAME,
	SITE_DESCRIPTION,
	DB_FIRESTORE_SMASH_COLLECTION_NAME,
} = publicRuntimeConfig;
