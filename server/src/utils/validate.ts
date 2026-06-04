import { z } from "zod";
import { AppError } from "./AppError";

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues
      .map((i) => {
        const label = i.path.length ? i.path.join(".") + ": " : "";
        const isRequiredError =
          i.code === "invalid_type" && (i as any).received === "undefined";
        return label + (isRequiredError ? "Required" : i.message);
      })
      .join("; ");
    throw new AppError(messages, 400);
  }
  return result.data;
}
