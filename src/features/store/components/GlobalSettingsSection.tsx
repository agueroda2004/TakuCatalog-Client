import SecondaryTitle from "./SecondaryTitle";
import CustomDropDown from "../../../components/global/CustomDropDown";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import type { Store } from "../../../types/apiResponse/store";

type StoreFieldValue = string | File | null;

type Props = {
  store: Store;
  fieldErrors: Record<string, string>;
  isEditing: boolean;
  languageOptions: { text: string; value: string }[];
  currencyOptions: { text: string; value: string }[];
  onLanguageChange: (lang: string) => void;
  onFieldChange: (field: keyof Store, value: StoreFieldValue) => void;
};

export default function GlobalSettingsSection({
  store,
  fieldErrors,
  isEditing,
  languageOptions,
  currencyOptions,
  onLanguageChange,
  onFieldChange,
}: Props) {
  const { t: translate } = useTranslation();

  return (
    <section className="w-full border rounded-lg border-gray-200 p-4">
      <SecondaryTitle
        title={translate("myStore.Global Settings")}
        description={translate(
          "myStore.Localization and formatting rules of your store",
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          className={`flex flex-col gap-1 w-full col-span-1 ${!isEditing ? "pointer-events-none" : ""}`}
        >
          <label className="text-sm font-medium">
            {translate("myStore.Language")}
          </label>
          <CustomDropDown
            options={languageOptions}
            onSelect={(value) => {
              onLanguageChange(value);
              onFieldChange("language", value);
            }}
            selectedValue={i18n.language}
          />
        </div>
        <div
          className={`flex flex-col gap-1 w-full col-span-1 ${!isEditing ? "pointer-events-none" : ""}`}
        >
          <label className="text-sm font-medium">
            {translate("myStore.Currency")}
          </label>
          <CustomDropDown
            options={currencyOptions}
            onSelect={(value) => onFieldChange("currency", value)}
            selectedValue={store.currency}
          />
          {fieldErrors.currency && (
            <span className="text-sm text-red-500">
              {fieldErrors.currency}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}