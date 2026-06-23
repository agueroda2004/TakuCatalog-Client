import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../../../api/client";
import { useStoreStore } from "../../../store/useStoreStore";
import type { ApiResponseError } from "../../../types";
import type { CreateProductPayload } from "../product.schema";

export default function useProduct() {
  const QUERY_KEY = "products";
  const api = useApiClient();
  const { id: storeId } = useStoreStore();
  const queryClient = useQueryClient();

  const createProduct = useMutation<
    void,
    ApiResponseError,
    CreateProductPayload
  >({
    mutationFn: async (payload) =>
      api.post("/product", { ...payload, storeId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, storeId],
      });
    },
  });

  return {
    createProduct: createProduct.mutate,
    createProductAsync: createProduct.mutateAsync,
    isCreating: createProduct.isPending,
    error: createProduct.error,
  };
}