import toast from "react-hot-toast";
import useProductType from "../hooks/useProductType";
import CustomToast from "../../../components/CustomToast";
import { useState } from "react";
import { logError } from "../../../utils/logError";
import { useTranslation } from "react-i18next";

type DeleteFormProps = {
  onClose: () => void;
  id: string;
  productTypeName: string;
};

export default function DeleteForm({
  onClose,
  productTypeName,
  id,
}: DeleteFormProps) {
  const { t: translate } = useTranslation();
  const { deleteProductType, isDeleting } = useProductType();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!id) {
      setServerError(
        translate("productType.Product type ID is required for deleting."),
      );
      return;
    }
    deleteProductType.mutate(
      { id },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              success={true}
              title={translate("productType.Deleted")}
              message={translate(
                "productType.Product type deleted successfully.",
              )}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const errorMessage =
            error?.message ||
            translate(
              "productType.An error occurred while deleting the product type",
            );
          setServerError(errorMessage);
          logError(error, "Error deleting product type");
        },
      },
    );
  };

  return (
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Begin: Form Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-md text-primary font-semibold">
          {translate("productType.Delete Product Type")}
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

        <p className="text-sm text-gray-700 text-start">
          {translate(
            "productType.Are you sure you want to delete the product type '{{name}}'? This action cannot be undone.",
            { name: productTypeName },
          )}
        </p>
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
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            translate("productType.Delete")
          )}
        </button>
      </div>
      {/* End: Form Footer */}
    </div>
  );
}
