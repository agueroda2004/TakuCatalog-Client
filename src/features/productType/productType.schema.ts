import z from "zod";

export const CreateProductTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  active: z.boolean().default(true),
});
