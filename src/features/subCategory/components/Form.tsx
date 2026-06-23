import { useCallback, useState } from "react";
import Dropdown from "../../../components/ui/Dropdown";
import useProductType from "../../productType/hooks/useProductType";
import type { SubCategory, SubCategoryError } from "../subCategory";
import { useTranslation } from "react-i18next";
import { CreateSubCategorySchema } from "../subCategory.schema";
import useSubCategory from "../hooks/useSubCategory";
import toast from "react-hot-toast";
import CustomToast from "../../../components/CustomToast";
import { logError } from "../../../utils/logError";

type FormProps = {
  onClose: () => void;
  selectedSubCategory?: SubCategory | null;
};

export default function Form({ onClose, selectedSubCategory }: FormProps) {
  const { t: translate } = useTranslation();
  const { productTypesDropdown } = useProductType();
  const { createSubCategory, isCreating, updateSubCategory, isUpdating } =
    useSubCategory();

  const adaptProductTypeToDropdown = useCallback(
    (productTypes: { name: string; id: string }[]) =>
      productTypes.map((type) => ({ text: type.name, value: type.id })),
    [],
  );

  const [subCategory, setSubCategory] = useState<SubCategory>({
    id: selectedSubCategory?.id || "",
    name: selectedSubCategory?.name || "",
    productTypeId: selectedSubCategory?.productTypeId || "",
    active: selectedSubCategory?.active ?? true,
    _count: {
      products: selectedSubCategory?._count.products || 0,
    },
  });

  const [errors, setErrors] = useState<SubCategoryError>({});
  const [serverError, setServerError] = useState<string>("");

  const handleSubmit = () => {
    const result = CreateSubCategorySchema.safeParse(subCategory);

    if (!result.success) {
      const fieldErrors: SubCategoryError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SubCategoryError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    if (selectedSubCategory) {
      const noChanges =
        subCategory.name === selectedSubCategory.name &&
        subCategory.active === selectedSubCategory.active;

      if (noChanges) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            success={true}
            title={translate("subCategory.No Changes")}
            message={translate("subCategory.No changes to update")}
          />
        ));
        onClose();
        return;
      }

      if (subCategory.id === "") {
        setServerError(
          translate("subCategory.Subcategory ID is required for updating."),
        );
        return;
      }
      updateSubCategory.mutate(
        {
          id: selectedSubCategory.id,
          name: result.data.name,
          active: result.data.active,
        },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <CustomToast
                t={t}
                success={true}
                title={translate("subCategory.Success")}
                message={translate(
                  "subCategory.Subcategory updated successfully.",
                )}
              />
            ));
            onClose();
          },
          onError: (error) => {
            const errorMessage =
              error?.message ||
              translate(
                "subCategory.An error occurred while updating the subcategory",
              );
            logError(error, "Error updating subcategory");
            setServerError(errorMessage);
          },
        },
      );
    } else {
      createSubCategory.mutate(result.data, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              success={true}
              title={translate("subCategory.Success")}
              message={translate(
                "subCategory.Subcategory created successfully.",
              )}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const errorMessage =
            error?.message ||
            translate(
              "subCategory.An error occurred while creating the subcategory",
            );
          logError(error, "Error creating subcategory");
          setServerError(errorMessage);
        },
      });
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg border border-gray-200">
      {/* Begin: Form Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-md text-primary">
          {selectedSubCategory
            ? translate("subCategory.Update Subcategory")
            : translate("subCategory.Create Subcategory")}
        </h3>
        <button
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      {/* End: Form Header */}

      {/* Begin: Form Body */}
      <div className="p-4 space-y-2">
        {/* Begin: Server Error */}
        {serverError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-lg text-sm">
            {translate(`subCategory.${serverError}`)}
          </div>
        )}
        {/* End: Server Error */}

        {/* Begin: Name Input */}
        <div className="space-y-1">
          <label className="text-xs">{translate("subCategory.Name")}</label>
          <input
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all"
            placeholder={translate(
              "subCategory.e.g. Electronics, Apparel, Home Goods",
            )}
            type="text"
            value={subCategory.name}
            onChange={(e) => {
              setSubCategory({ ...subCategory, name: e.target.value });
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`subCategory.${errors.name}`)}
            </p>
          )}
        </div>
        {/* End: Name Input */}

        {/* Begin: Product Type Dropdown */}
        <div className="space-y-1">
          <label className="text-xs">
            {translate("subCategory.Product Type")}
          </label>
          {selectedSubCategory ? (
            <div className="bg-orange-100 text-orange-700 p-2 rounded-lg text-sm">
              {translate(
                "subCategory.The product type cannot be changed because the subcategory may have products associated with it.",
              )}
            </div>
          ) : (
            <Dropdown
              options={adaptProductTypeToDropdown(productTypesDropdown)}
              placeholder={translate("subCategory.Select a product type")}
              selected={subCategory.productTypeId}
              onSelect={(value) => {
                setSubCategory({ ...subCategory, productTypeId: value });
                setErrors((prev) => ({ ...prev, productTypeId: undefined }));
              }}
            />
          )}

          {errors.productTypeId && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`subCategory.${errors.productTypeId}`)}
            </p>
          )}
        </div>
        {/* End: Product Type Dropdown */}

        {/* Begin: Active Toggle (only in update mode) */}
        {selectedSubCategory && (
          <div className="space-y-1">
            <label className="text-xs">{translate("subCategory.Status")}</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg w-full px-4 py-2">
              <label className="text-xs text-text-primary uppercase">
                {translate("subCategory._Active")}
              </label>
              <div
                className={`size-5 ${subCategory.active ? "bg-primary" : "bg-gray-300"} rounded-lg cursor-pointer active:scale-95 transition-transform`}
                onClick={() =>
                  setSubCategory({
                    ...subCategory,
                    active: !subCategory.active,
                  })
                }
              />
            </div>
          </div>
        )}
        {/* End: Active Toggle */}
      </div>
      {/* End: Form Body */}

      {/* Begin: Form Footer */}
      <div className="bg-surface-container-low px-4 py-4 flex justify-end gap-3">
        <button
          className="min-w-30 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 bg-gray-100 border-gray-200 border cursor-pointer active:scale-[0.98] transition-all"
          onClick={onClose}
        >
          {translate("subCategory.Cancel")}
        </button>
        <button
          className="min-w-30 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          onClick={handleSubmit}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : selectedSubCategory ? (
            translate("subCategory.Update")
          ) : (
            translate("subCategory.Create")
          )}
        </button>
      </div>
      {/* End: Form Footer */}
    </div>
  );
}
