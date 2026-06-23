import SecondaryTitle from "./SecondaryTitle";
import ColorSelector from "./ColorSelector";
import SelectImage from "./SelectImage";
import type { Store } from "../../../types/apiResponse/store";
import { useTranslation } from "react-i18next";

type StoreFieldValue = string | File | null;

type Props = {
  store: Store;
  isEditing: boolean;
  addNewColor: boolean;
  setAddNewColor: (value: boolean) => void;
  colorError?: string;
  onFieldChange: (field: keyof Store, value: StoreFieldValue) => void;
  onLogoChange: (file: File) => void;
  logoUrl?: string;
};

export default function AppearanceSection({
  store,
  isEditing,
  addNewColor,
  setAddNewColor,
  colorError,
  onFieldChange,
  onLogoChange,
  logoUrl,
}: Props) {
  const { t: translate } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row w-full gap-4">
      <section
        className={`w-full border rounded-lg border-gray-200 p-4 ${!isEditing ? "pointer-events-none" : ""}`}
      >
        <SecondaryTitle
          title={translate("myStore.Color Settings")}
          description={translate(
            "myStore.Manage your store's color scheme and create a unique visual identity for your catalog.",
          )}
        />
        <ColorSelector
          selectedColor={store.color}
          setSelectedColor={(color) => onFieldChange("color", color)}
          addNewColor={addNewColor}
          setAddNewColor={setAddNewColor}
          error={colorError}
        />
      </section>

      <section className="w-full border rounded-lg border-gray-200 p-4 flex flex-col">
        <SecondaryTitle
          title={translate("myStore.Brand Logo")}
          description={translate("myStore.Manage your store's brand logo")}
        />
        <div className="flex justify-center items-center flex-1">
          <div
            className={`rounded-lg size-full ${!isEditing ? "pointer-events-none" : ""}`}
          >
            <SelectImage
              previewUrl={store.logoPreview || logoUrl}
              onImageSelect={onLogoChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
}