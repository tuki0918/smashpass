import type { ZodSchema } from "zod";
import { z } from "zod";

export function validateEnv<T extends ZodSchema>(
	schema: T,
	env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): z.infer<T> {
	const result = schema.safeParse(env);
	if (!result.success) {
		console.error(
			"Environment variable validation failed:",
			result.error.format(),
		);
		throw new Error("Invalid environment variables");
	}
	return result.data;
}

// Custom methods
const envNumber = () =>
	z.preprocess((v) => Number(v) || 0, z.number().int().nonnegative());
const envBoolean = () => z.preprocess((v) => Boolean(v), z.boolean());

const g = {
	envObject: z.object,
	envEnum: z.enum,
	envString: z.string,
	envNumber,
	envBoolean,
};

export { g };
