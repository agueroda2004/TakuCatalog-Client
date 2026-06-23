import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../../api/client";
import { useStoreStore } from "../../../store/useStoreStore";
import type { ApiResponse } from "../../../utils/ApiResponse/apiResponse";
import type { PaginatedSubCategories } from "../../subCategory/subCategory";

type SubCategoryOption = { id: string; name: string };

export default function useSubCategoriesByProductType(productTypeId: string) {
  const QUERY_KEY = "sub-categories-by-product-type";
  const api = useApiClient();
  const { id: storeId } = useStoreStore();

  return useQuery<SubCategoryOption[]>({
    queryKey: [QUERY_KEY, storeId, productTypeId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedSubCategories>>(
        `/subCategory/store/${storeId}?productTypeId=${productTypeId}&limit=1000`,
      );
      return response.data.items.map((s) => ({
        id: s.id,
        name: s.name,
      }));
    },
    enabled: !!storeId && !!productTypeId,
  });
}