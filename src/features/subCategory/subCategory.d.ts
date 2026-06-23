import { z } from "zod";
import type { CreateSubCategorySchema } from "./subCategory.schema";
import type { PaginationResult } from "../../types";

export type SubCategoryPayload = z.infer<typeof CreateSubCategorySchema>;
export type SubCategoryError = Partial<
  Record<keyof SubCategoryPayload, string>
>;

export type SubCategoryUpdatePayload = Omit<
  SubCategoryPayload,
  "productTypeId"
>;

export type SubCategory = {
  id: string;
  name: string;
  active: boolean;
  productTypeId: string;
  _count: {
    products: number;
  };
};

export type PaginatedSubCategories = {
  items: SubCategory[];
  pagination: PaginationResult;
};
