export type CreateStoreResponse = {
  id: string;
};

// + Updated June 7, 2026 - Added fileId to manage the future deletation of the logo
export type UpdateStoreLogoDTO = {
  storeId: string;
  logoUrl: string;
  fileId: string;
};
