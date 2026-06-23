import type z from "zod";
import type { CreateProductTypeSchema } from "./productType.schema";
import type { PaginationResult } from "../../types";

export type ProductTypePayload = z.infer<typeof CreateProductTypeSchema>;
export type ProductTypeError = Partial<
  Record<keyof ProductTypePayload, string>
>;

export type ProductTypePayload = {
  name: string;
};

export type ProductType = {
  id: string;
  name: string;
  active: boolean;
  _count: {
    products: number;
  };
};

export type PaginatedProductTypes = {
  items: ProductType[];
  pagination: PaginationResult;
};
