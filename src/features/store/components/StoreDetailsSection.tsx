import SecondaryTitle from "./SecondaryTitle";
import InputText from "../../../components/global/InputText";
import { TAKU_SLUG } from "../../../constants/data";
import type { Store } from "../../../types/apiResponse/store";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

type StoreFieldValue = string | File | null;

type Props = {
  store: Store;
  fieldErrors: Record<string, string>;
  isEditing: boolean;
  onFieldChange: (field: keyof Store, value: StoreFieldValue) => void;
};

export default function StoreDetailsSection({
  store,
  fieldErrors,
  isEditing,
  onFieldChange,
}: Props) {
  const { t: translate } = useTranslation();

  return (
    <section className="w-full border rounded-lg border-gray-200 p-4">
      <SecondaryTitle
        title={translate("myStore.Store Details")}
        description={translate(
          "myStore.Basic information about your store that will be displayed to customers",
        )}
      />
      <div className="flex flex-row gap-6 flex-wrap md:flex-nowrap">
        <div className="flex flex-col gap-2 w-full">
          <InputText
            label={translate("myStore.Store Name")}
            placeholder={translate("myStore.Your Store Name")}
            value={store.name}
            onChange={(value) => onFieldChange("name", value)}
            disabled={!isEditing}
            error={fieldErrors.name}
          />
          <div className="flex flex-col">
            <label className="text-sm font-medium">
              {translate("myStore.Store Slug")}
            </label>
            <div className="relative">
              <span className="absolute px-2 flex justify-center items-center rounded-l-lg text-gray-400 h-full">
                {TAKU_SLUG}
              </span>
              <input
                className="pl-31 py-2 border border-gray-200 outline-none focus:border-primary rounded-lg transition-colors w-full disabled:bg-gray-50"
                placeholder={translate("myStore.your-store-slug")}
                type="text"
                disabled={!isEditing}
                value={store.slug}
                onChange={(e) => onFieldChange("slug", e.target.value)}
              />
            </div>
            {fieldErrors.slug && (
              <span className="text-sm text-red-500">{fieldErrors.slug}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}