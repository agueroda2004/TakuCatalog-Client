import { useState } from "react";
import useProductType from "../hooks/useProductType";
import type { ProductType, ProductTypeError } from "../productType";
import { CreateProductTypeSchema } from "../productType.schema";
import toast from "react-hot-toast";
import CustomToast from "../../../components/CustomToast";
import { logError } from "../../../utils/logError";
import { useTranslation } from "react-i18next";

type FormProps = {
  onClose: () => void;
  selectedProductType?: ProductType | null;
};

export default function Form({ onClose, selectedProductType }: FormProps) {
  const { t: translate } = useTranslation();
  const { createProductType, isCreating, updateProductType, isUpdating } =
    useProductType();

  const [productType, setProductType] = useState<ProductType>({
    id: selectedProductType?.id || "",
    name: selectedProductType?.name || "",
    active:
      selectedProductType?.active !== undefined
        ? selectedProductType.active
        : true,
    _count: {
      products: selectedProductType?._count.products || 0,
    },
  });

  const [errors, setErrors] = useState<ProductTypeError>({});
  const [serverError, setServerError] = useState<string>("");

  const handleSubmit = () => {
    const result = CreateProductTypeSchema.safeParse(productType);

    if (!result.success) {
      const fieldErrors: ProductTypeError = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ProductTypeError;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    if (selectedProductType) {
      const noChanges =
        JSON.stringify(productType) === JSON.stringify(selectedProductType);

      if (noChanges) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            success={true}
            title={translate("productType.No Changes")}
            message={translate("productType.No changes to update")}
          />
        ));
        onClose();
        return;
      }

      if (productType.id === "") {
        setServerError(
          translate("productType.Product type ID is required for updating."),
        );
        return;
      }

      updateProductType.mutate(
        { id: selectedProductType.id, ...result.data },
        {
          onSuccess: () => {
            toast.custom((t) => (
              <CustomToast
                t={t}
                success={true}
                title={translate("productType.Success")}
                message={translate(
                  "productType.Product type updated successfully.",
                )}
              />
            ));
            onClose();
          },
          onError: (error) => {
            const errorMessage =
              error?.message ||
              translate(
                "productType.An error occurred while updating the product type",
              );
            setServerError(errorMessage);
            logError(error, "Error updating product type");
          },
        },
      );
    } else {
      createProductType.mutate(result.data, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              success={true}
              title={translate("productType.Success")}
              message={translate(
                "productType.Product type created successfully.",
              )}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const errorMessage =
            error?.message ||
            translate(
              "productType.An error occurred while creating the product type",
            );
          logError(error, "Error creating product type");
          setServerError(errorMessage);
        },
      });
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Begin: Form Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-md text-primary">
          {selectedProductType
            ? translate("productType.Update Product Type")
            : translate("productType.Create Product Type")}
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
            {translate(`productType.${serverError}`)}
          </div>
        )}
        {/* End: Server Error */}

        {/* Begin: Name Input */}
        <div className="space-y-1">
          <label className="text-xs">{translate("productType.Name")}</label>
          <input
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all"
            placeholder={translate(
              "productType.e.g. Electronics, Apparel, Home Goods",
            )}
            type="text"
            value={productType.name}
            onChange={(e) =>
              setProductType({ ...productType, name: e.target.value })
            }
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`productType.${errors.name}`)}
            </p>
          )}
        </div>
        {/* End: Name Input */}

        {/* Begin: Active toggle */}
        {selectedProductType && (
          <div className="space-y-1">
            <label className="text-xs">{translate("productType.Status")}</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg w-full px-4 py-2">
              <label className="text-xs text-text-primary uppercase">
                {translate("productType._Active")}
              </label>
              <div
                className={`size-5 ${productType.active ? "bg-primary" : "bg-gray-300"} rounded-lg cursor-pointer active:scale-95 transition-transform`}
                onClick={() =>
                  setProductType({
                    ...productType,
                    active: !productType.active,
                  })
                }
              />
            </div>
          </div>
        )}
        {/* End: Active toggle */}
      </div>
      {/* End: Form Body */}

      {/* Begin: Form Footer */}
      <div className="bg-surface-container-low px-4 py-4 flex justify-end gap-3">
        <button
          className="min-w-30 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 bg-gray-100 border-gray-200 border cursor-pointer active:scale-[0.98] transition-all"
          onClick={onClose}
        >
          {translate("productType.Cancel")}
        </button>
        <button
          className="min-w-30 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          onClick={handleSubmit}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : selectedProductType ? (
            translate("productType.Update")
          ) : (
            translate("productType.Create")
          )}
        </button>
      </div>
      {/* End: Form Footer */}
    </div>
  );
}
