import { z } from "zod";

export const CreateSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  productTypeId: z.string().min(1, "Product Type is required"),
  active: z.boolean().default(true),
});
