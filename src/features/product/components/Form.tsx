import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "../../../components/ui/Dropdown";
import SelectImage from "../../store/components/SelectImage";
import useProductType from "../../productType/hooks/useProductType";
import useSubCategoriesByProductType from "../hooks/useSubCategoriesByProductType";
import { CreateProductSchema } from "../product.schema";

type VariantFormState = {
  name: string;
  price: string;
  stock: string;
};

type ProductFormState = {
  name: string;
  description: string;
  productTypeId: string;
  subCategoryId: string;
  imageFile: File | null;
  imagePreview: string | null;
  variants: VariantFormState[];
};

type ProductFormError = {
  name?: string;
  description?: string;
  productTypeId?: string;
  subCategoryId?: string;
  image?: string;
  variants?: string;
};

type FormProps = {
  onClose: () => void;
};

export default function Form({ onClose }: FormProps) {
  const { t: translate } = useTranslation();
  const { productTypesDropdown } = useProductType();

  const [formState, setFormState] = useState<ProductFormState>({
    name: "",
    description: "",
    productTypeId: "",
    subCategoryId: "",
    imageFile: null,
    imagePreview: null,
    variants: [{ name: "", price: "", stock: "" }],
  });

  const [errors, setErrors] = useState<ProductFormError>({});

  const { data: subCategoriesDropdown = [] } = useSubCategoriesByProductType(
    formState.productTypeId,
  );

  const productTypeOptions = useMemo(
    () =>
      productTypesDropdown.map((pt) => ({
        text: pt.name,
        value: pt.id,
      })),
    [productTypesDropdown],
  );

  const subCategoryOptions = useMemo(
    () =>
      subCategoriesDropdown.map((sc) => ({
        text: sc.name,
        value: sc.id,
      })),
    [subCategoriesDropdown],
  );

  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  const updateField = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field as keyof ProductFormError]: undefined,
    }));
  };

  const handleImageChange = (file: File) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setFormState((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: url,
    }));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleProductTypeChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      productTypeId: value,
      subCategoryId: "",
    }));
    setErrors((prev) => ({
      ...prev,
      productTypeId: undefined,
      subCategoryId: undefined,
    }));
  };

  const handleAddVariant = () => {
    setFormState((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "", stock: "" }],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantFormState,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v,
      ),
    }));
    setErrors((prev) => ({ ...prev, variants: undefined }));
  };

  const handleSubmit = () => {
    const newErrors: ProductFormError = {};

    if (!formState.imageFile) {
      newErrors.image = "Image is required";
    }

    const validationPayload = {
      name: formState.name,
      description: formState.description || undefined,
      productTypeId: formState.productTypeId,
      subCategoryId: formState.subCategoryId,
      variants: formState.variants.map((v) => ({
        name: v.name,
        price: v.price === "" ? Number.NaN : Number(v.price),
        stock: v.stock === "" ? undefined : Number(v.stock),
      })),
    };

    const result = CreateProductSchema.safeParse(validationPayload);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key === "variants") {
          if (!newErrors.variants) newErrors.variants = issue.message;
        } else if (typeof key === "string") {
          const errorKey = key as keyof ProductFormError;
          if (!newErrors[errorKey]) {
            newErrors[errorKey] = issue.message;
          }
        }
      }
    }

    setErrors(newErrors);
  };

  return (
    <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 className="text-md text-primary">
          {translate("product.Create Product")}
        </h3>
        <button
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-xs">{translate("product.Name")}</label>
          <input
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all"
            placeholder={translate("product.e.g. Nike Air Max")}
            type="text"
            value={formState.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`product.${errors.name}`)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs">
            {translate("product.Description")}
          </label>
          <textarea
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all resize-none"
            placeholder={translate("product.Optional description")}
            maxLength={255}
            rows={3}
            value={formState.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`product.${errors.description}`)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs">{translate("product.Image")}</label>
          <SelectImage
            previewUrl={formState.imagePreview ?? undefined}
            onImageSelect={handleImageChange}
            title="product.Upload Image"
            subtitle="product.Supports PNG, JPG"
            errorNamespace="product"
            error={errors.image}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs">
            {translate("product.Product Type")}
          </label>
          <Dropdown
            options={productTypeOptions}
            placeholder={translate("product.Select a product type")}
            selected={formState.productTypeId}
            onSelect={handleProductTypeChange}
          />
          {errors.productTypeId && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`product.${errors.productTypeId}`)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs">
            {translate("product.Sub Category")}
          </label>
          <Dropdown
            options={subCategoryOptions}
            placeholder={translate("product.Select a sub category")}
            selected={formState.subCategoryId}
            onSelect={(value) => updateField("subCategoryId", value)}
          />
          {errors.subCategoryId && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`product.${errors.subCategoryId}`)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs">
              {translate("product.Variants")}
            </label>
            <button
              type="button"
              className="text-xs text-primary font-semibold flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAddVariant}
            >
              <span className="material-symbols-outlined text-[16px]">
                add
              </span>
              {translate("product.Add Variant")}
            </button>
          </div>

          {formState.variants.map((variant, index) => (
            <div
              key={index}
              className="flex gap-2 items-start border border-gray-100 rounded-lg p-2 bg-gray-50"
            >
              <div className="flex-1">
                <input
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all"
                  placeholder={translate("product.Variant name")}
                  type="text"
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="w-24">
                <input
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all"
                  placeholder={translate("product.Price")}
                  type="number"
                  min={1}
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="w-24">
                <input
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary outline-none transition-all"
                  placeholder={translate("product.Stock")}
                  type="number"
                  min={0}
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                />
              </div>
              {formState.variants.length > 1 && (
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 transition-colors cursor-pointer mt-1.5"
                  onClick={() => handleRemoveVariant(index)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                </button>
              )}
            </div>
          ))}
          {errors.variants && (
            <p className="text-red-500 text-xs mt-1">
              {translate(`product.${errors.variants}`)}
            </p>
          )}
        </div>
      </div>

      <div className="bg-surface-container-low px-4 py-4 flex justify-end gap-3 sticky bottom-0">
        <button
          className="min-w-30 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 bg-gray-100 border-gray-200 border cursor-pointer active:scale-[0.98] transition-all"
          onClick={onClose}
        >
          {translate("product.Cancel")}
        </button>
        <button
          className="min-w-30 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          onClick={handleSubmit}
        >
          {translate("product.Create")}
        </button>
      </div>
    </div>
  );
}