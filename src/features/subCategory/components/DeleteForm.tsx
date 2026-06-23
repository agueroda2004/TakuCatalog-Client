import toast from "react-hot-toast";
import useSubCategory from "../hooks/useSubCategory";
import CustomToast from "../../../components/CustomToast";
import { useState } from "react";
import { logError } from "../../../utils/logError";
import { useTranslation } from "react-i18next";

type DeleteFormProps = {
  onClose: () => void;
  id: string;
  subCategoryName: string;
};

export default function DeleteForm({
  onClose,
  subCategoryName,
  id,
}: DeleteFormProps) {
  const { t: translate } = useTranslation();
  const { deleteSubCategory, isDeleting } = useSubCategory();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!id) {
      setServerError(
        translate("subCategory.Subcategory ID is required for deleting."),
      );
      return;
    }
    deleteSubCategory.mutate(
      { id },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              t={t}
              success={true}
              title={translate("subCategory.Deleted")}
              message={translate(
                "subCategory.Subcategory deleted successfully.",
              )}
            />
          ));
          onClose();
        },
        onError: (error) => {
          const errorMessage =
            error?.message ||
            translate(
              "subCategory.An error occurred while deleting the subcategory",
            );
          setServerError(errorMessage);
          logError(error, "Error deleting subcategory");
        },
      },
    );
  };

  return (
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Begin: Form Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-md text-primary font-semibold">
          {translate("subCategory.Delete Subcategory")}
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

        <p className="text-sm text-gray-700 text-start">
          {translate(
            "subCategory.Are you sure you want to delete the subcategory '{{name}}'? This action cannot be undone.",
            { name: subCategoryName },
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
          {translate("subCategory.Cancel")}
        </button>
        <button
          className="min-w-30 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            translate("subCategory.Delete")
          )}
        </button>
      </div>
      {/* End: Form Footer */}
    </div>
  );
}