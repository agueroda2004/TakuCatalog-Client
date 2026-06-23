import { z } from "zod";

const variantSchema = z.object({
  name: z
    .string()
    .min(2, "Variant name must be at least 2 characters long")
    .max(255, "Variant name must be at most 255 characters long"),
  price: z
    .number()
    .positive("Price must be positive")
    .min(1, "Price must be at least 1")
    .max(1000000, "Price must be at most 1,000,000"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .positive("Stock must be positive")
    .max(1000000, "Stock must be at most 1,000,000")
    .optional(),
});

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(255, "Name must be at most 255 characters long"),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters long")
    .optional(),
  productTypeId: z.string().min(1, "Product type is required"),
  subCategoryId: z.string().min(1, "Sub category is required"),
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required"),
});

export type CreateProductPayload = {
  name: string;
  description?: string;
  storeId: string;
  productTypeId: string;
  subCategoryId: string;
  image: { url: string; fileId: string };
  variants: { name: string; price: number; stock?: number }[];
};