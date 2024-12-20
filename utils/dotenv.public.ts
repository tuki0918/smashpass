import { zenv } from "dotenv-zod-validator";

export const schema = zenv.object({
	NEXT_PUBLIC_FIREBASE_API_KEY: zenv.string(),
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: zenv.string(),
	NEXT_PUBLIC_FIREBASE_PROJECT_ID: zenv.string(),
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: zenv.string(),
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: zenv.string(),
	NEXT_PUBLIC_FIREBASE_APP_ID: zenv.string(),
	NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: zenv.string(),
});

export const ENV = zenv.validate(schema, {
	/**
	 * Next.js will replace process.env.customKey with 'my-value' at build time. Trying to destructure process.env variables won't work due to the nature of webpack
	 * https://nextjs.org/docs/pages/api-reference/next-config-js/env
	 */
	// NEXT_PUBLIC_XXX: process.env.NEXT_PUBLIC_XXX,
	NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
		process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
		process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
		process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
		process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});
