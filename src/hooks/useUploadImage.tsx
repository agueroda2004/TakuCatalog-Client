import { useApiClient } from "../api/client";
import type { uploadImageResponse } from "../types/apiResponse/uploadImage";
import type { ApiResponse } from "../utils/ApiResponse/apiResponse";

export default function useUploadImage() {
  const api = useApiClient();

  return {
    getImageKitAuth: async (storeId: string, folderName: string) =>
      api.get<ApiResponse<uploadImageResponse>>(
        `/upload/${storeId}/auth/${folderName}`,
      ),
  };
}
