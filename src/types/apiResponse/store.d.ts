import { z } from "zod";
import type { StoreSchema } from "../../schemas/store.schema";

// === TYPES ===
export type Store = {
  color: string;
  name: string;
  slug: string;
  currency: string;
  logoFile: File | null;
  logoPreview: string | null;
  countryCode: string;
  phoneNumber: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  language: string;
};

// === DTOS ===
export type UpdateStoreDTO = {
  name?: string;
  slug?: string;
  phoneNumber?: string;
  color?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  currency?: string;
  countryCode?: string;
  language?: string;
  logo?: {
    url: string;
    fileId: string | null;
  };
};

// === API RESPONSES ===
export type HasStoreResponse = {
  hasStore: boolean;
  store: StoreGlobalContext | null;
};

// * Added June 7, 2026 - Added fileId to manage the future deletation of the logo
export type CreateStoreResponse = Omit<
  StoreGlobalContext,
  "logoUrl" | "fileId"
>;

// * Added June 7, 2026 - Added fileId to manage the future deletation of the logo
export type StoreGlobalContext = {
  id: string;
  name: string;
  slug: string;
  phoneNumber: string;
  color: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  currency: string;
  countryCode: string;
  logo: {
    url: string;
    fileId: string | null; // + Updated June 7, 2026 - Added fileId to manage the future deletation of the logo
  } | null;
  language: string;
};
