import type { z } from "zod";
import type { CreateProductSchema } from "./product.schema";

export type CreateProductPayload = z.infer<typeof CreateProductSchema>;

export type ProductError = Partial<
  Record<keyof CreateProductPayload, string>
>;