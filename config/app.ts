import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const { SITE_NAME, SITE_DESCRIPTION } = publicRuntimeConfig;
