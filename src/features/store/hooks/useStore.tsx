import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../../../api/client";
import type { CreateStoreData } from "../../../schemas/store.schema";
import { logError } from "../../../utils/logError";
import type { UpdateStoreLogoDTO } from "../../../utils/ApiResponse/store";
import type { ApiResponse } from "../../../utils/ApiResponse/apiResponse";
import type {
  CreateStoreResponse,
  HasStoreResponse,
  UpdateStoreDTO,
} from "../../../types/apiResponse/store";
import { useStoreStore } from "../../../store/useStoreStore";

export default function useStore() {
  const queryClient = useQueryClient();
  const api = useApiClient();
  const QUERY_KEY = "store";
  const { id: storeId } = useStoreStore();

  const hasStore = async () =>
    api
      .get<ApiResponse<HasStoreResponse>>("/store/has-store")
      .then((res) => res.data);

  // + Updated June 7, 2026 - Added fileId to manage the future deletation of the logo
  const createMutation = useMutation({
    mutationFn: async (data: CreateStoreData) =>
      api.post<ApiResponse<CreateStoreResponse>>("/store", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      logError(error, "Error creating store");
    },
  });

  // + Updated June 7, 2026 - Added fileId to manage the future deletation of the logo
  const updateLogoMutation = useMutation({
    mutationFn: async (data: UpdateStoreLogoDTO) =>
      api.patch(`/store/${data.storeId}/logo`, {
        logoUrl: data.logoUrl,
        fileId: data.fileId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      logError(error, "Error updating store logo");
    },
  });

  // * Added June 7, 2026 - Added updateStore function to allow updating store data
  const updateStoreMutation = useMutation({
    mutationFn: async (data: UpdateStoreDTO) => {
      return api.patch<ApiResponse<null>>(`/store/${storeId}`, data);
    },
  });

  const deleteLogoMutation = useMutation({
    mutationFn: async (fileId: string) =>
      api.delete<ApiResponse<null>>(`/store/${storeId}/logo/${fileId}`),
  });

  return {
    hasStore: hasStore,

    createStore: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateStore: updateStoreMutation.mutateAsync,
    isUpdating: updateStoreMutation.isPending,

    updateLogo: updateLogoMutation.mutateAsync,
    isUpdatingLogo: updateLogoMutation.isPending,

    deleteLogo: deleteLogoMutation.mutateAsync,
  };
}
