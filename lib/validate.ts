import { ZodSchema } from "zod";

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  return result.data;
}
