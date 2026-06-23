import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ApiResponse } from "../../../utils/ApiResponse/apiResponse";
import type { ApiResponseError } from "../../../types";
import type {
  PaginatedSubCategories,
  SubCategoryPayload,
  SubCategoryUpdatePayload,
} from "../subCategory";
import { useApiClient } from "../../../api/client";
import { useStoreStore } from "../../../store/useStoreStore";

const STATUS_OPTIONS = [
  { value: "all", text: "subCategory.All Statuses" },
  { value: "active", text: "subCategory.Active" },
  { value: "inactive", text: "subCategory.Inactive" },
];

export default function useSubCategory() {
  const QUERY_KEY = "sub-categories";
  const queryClient = useQueryClient();
  const api = useApiClient();
  const { id: storeId } = useStoreStore();

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: STATUS_OPTIONS[0].value,
    productTypeId: "",
  });

  const [applyFilters, setApplyFilters] = useState({
    search: "",
    status: STATUS_OPTIONS[0].value,
    productTypeId: "",
  });

  const handleFilterChange = (
    field: keyof typeof filters,
    value: string | (typeof STATUS_OPTIONS)[0],
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: STATUS_OPTIONS[0].value,
      productTypeId: "",
    });
    setApplyFilters({
      search: "",
      status: STATUS_OPTIONS[0].value,
      productTypeId: "",
    });
  };

  const handleApplyFilters = () => {
    setApplyFilters(filters);
  };

  const getSubCategoriesByStore = useQuery({
    queryKey: [QUERY_KEY, applyFilters, page, storeId],
    queryFn: async () =>
      await api.get<ApiResponse<PaginatedSubCategories>>(
        `/subCategory/store/${storeId}?page=${page}&limit=${8}&search=${applyFilters.search}&status=${applyFilters.status}&productTypeId=${applyFilters.productTypeId}`,
      ),
    enabled: !!storeId,
  });

  const createSubCategory = useMutation<
    void,
    ApiResponseError,
    SubCategoryPayload
  >({
    mutationFn: async (payload: SubCategoryPayload) =>
      await api.post(`/subCategory`, { ...payload, storeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const updateSubCategory = useMutation<
    void,
    ApiResponseError,
    { id: string } & SubCategoryUpdatePayload
  >({
    mutationFn: async ({ id, ...payload }) =>
      await api.patch(`/subCategory/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const deleteSubCategory = useMutation<void, ApiResponseError, { id: string }>(
    {
      mutationFn: async ({ id }) => await api.delete(`/subCategory/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    },
  );

  return {
    STATUS_OPTIONS,
    filters,
    handleFilterChange,
    handleClearFilters,
    handleApplyFilters,
    setPage,
    page,

    createSubCategory,
    isCreating: createSubCategory.isPending,

    updateSubCategory,
    isUpdating: updateSubCategory.isPending,

    deleteSubCategory,
    isDeleting: deleteSubCategory.isPending,

    subCategories: getSubCategoriesByStore.data?.data.items,
    pagination: getSubCategoriesByStore.data?.data.pagination,

    isLoadingSubCategories: getSubCategoriesByStore.isPending,
  };
}
