import { schema as publicSchema } from "@/utils/dotenv.public";
import { zenv } from "dotenv-zod-validator";

const schema = zenv.object({
  //
});

export const ENV = zenv.validate(publicSchema.merge(schema));
