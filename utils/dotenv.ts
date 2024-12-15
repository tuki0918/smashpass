import { g, validateEnv } from "@/libs/dotenv";
import { schema as publicSchema } from "@/utils/dotenv.public";

const schema = g.envObject({});

export const env = validateEnv(publicSchema.merge(schema));
