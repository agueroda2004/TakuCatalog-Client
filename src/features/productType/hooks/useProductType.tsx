import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../../../utils/ApiResponse/apiResponse";
import type { ApiResponseError } from "../../../types";
import type { PaginatedProductTypes, ProductTypePayload } from "../productType";
import { useApiClient } from "../../../api/client";
import { useStoreStore } from "../../../store/useStoreStore";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "all", text: "productType.All Statuses" },
  { value: "active", text: "productType.Active" },
  { value: "inactive", text: "productType.Inactive" },
];

export default function useProductType() {
  const QUERY_KEY = "product-types";
  const queryClient = useQueryClient();
  const api = useApiClient();
  const { id: storeId } = useStoreStore();

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: STATUS_OPTIONS[0].value,
  });

  const [applyFilters, setApplyFilters] = useState({
    search: "",
    status: STATUS_OPTIONS[0].value,
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
    });
    setApplyFilters({
      search: "",
      status: STATUS_OPTIONS[0].value,
    });
  };

  const handleApplyFilters = () => {
    setApplyFilters(filters);
  };

  const getProductTypesByStore = useQuery({
    queryKey: [QUERY_KEY, applyFilters, page],
    queryFn: async () =>
      await api.get<ApiResponse<PaginatedProductTypes>>(
        `/productType/store/${storeId}?page=${page}&limit=${8}&search=${applyFilters.search}&status=${applyFilters.status}`,
      ),
  });

  const productTypesDropdown = useQuery({
    queryKey: ["product-types-dropdown", storeId],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{ id: string; name: string }[]>
      >(`/productType/dropdown/${storeId}`);
      return response.data;
    },
  });

  const createProductType = useMutation<
    void,
    ApiResponseError,
    ProductTypePayload
  >({
    mutationFn: async (payload: ProductTypePayload) =>
      api.post("/productType", { ...payload, storeId }),
    onSuccess: async () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["product-types-dropdown"] }),
      ]);
    },
  });

  const updateProductType = useMutation<
    void,
    ApiResponseError,
    { id: string } & ProductTypePayload
  >({
    mutationFn: async ({ id, ...payload }) =>
      api.patch(`/productType/${id}`, { ...payload, storeId }),
    onSuccess: async () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: ["product-types-dropdown"] }),
      ]);
    },
  });

  const deleteProductType = useMutation<void, ApiResponseError, { id: string }>(
    {
      mutationFn: async ({ id }) => api.delete(`/productType/${id}`),
      onSuccess: async () => {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
          queryClient.invalidateQueries({
            queryKey: ["product-types-dropdown"],
          }),
        ]);
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

    productTypesDropdown: productTypesDropdown.data || [],

    createProductType,
    isCreating: createProductType.isPending,

    updateProductType,
    isUpdating: updateProductType.isPending,

    deleteProductType,
    isDeleting: deleteProductType.isPending,

    productTypes: getProductTypesByStore.data?.data.items || [],
    pagination: getProductTypesByStore.data?.data.pagination,

    isLoadingProductTypes: getProductTypesByStore.isPending,
  };
}
