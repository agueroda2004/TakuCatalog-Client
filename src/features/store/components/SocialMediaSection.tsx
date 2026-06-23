import SecondaryTitle from "./SecondaryTitle";
import CustomDropDown from "../../../components/global/CustomDropDown";
import InputText from "../../../components/global/InputText";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "../../../components/icons/SocialIcons";
import { getMaxDigits, getPhonePlaceholder } from "../../../utils/phoneUtils";
import type { Store } from "../../../types/apiResponse/store";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

type StoreFieldValue = string | File | null;

type Props = {
  store: Store;
  fieldErrors: Record<string, string>;
  isEditing: boolean;
  countryCodeOptions: { text: string; value: string; prefix: JSX.Element | null }[];
  onFieldChange: (field: keyof Store, value: StoreFieldValue) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SocialMediaSection({
  store,
  fieldErrors,
  isEditing,
  countryCodeOptions,
  onFieldChange,
  onPhoneChange,
}: Props) {
  const { t: translate } = useTranslation();

  return (
    <section className="w-full border rounded-lg border-gray-200 p-4 flex flex-col gap-2">
      <SecondaryTitle
        title={translate("myStore.Social Media")}
        description={translate(
          "myStore.Manage your store's social media presence",
        )}
      />

      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium">
          {translate("myStore.Phone number")}
        </label>
        <div
          className={`flex items-center flex-row gap-2 ${!isEditing ? "pointer-events-none" : ""}`}
        >
          <div className="w-50">
            <CustomDropDown
              onSelect={(value) => onFieldChange("countryCode", value)}
              selectedValue={store.countryCode}
              options={countryCodeOptions}
            />
          </div>
          <input
            className="p-2 border border-gray-200 outline-none focus:border-primary rounded-lg transition-colors w-full disabled:bg-gray-50"
            placeholder={getPhonePlaceholder(store.countryCode)}
            type="text"
            value={store.phoneNumber}
            onChange={onPhoneChange}
            disabled={!isEditing}
            maxLength={getMaxDigits(store.countryCode) + 3}
          />
        </div>
        {fieldErrors.phoneNumber && (
          <span className="text-sm text-red-500">
            {fieldErrors.phoneNumber}
          </span>
        )}
      </div>

      <InputText
        label="Instagram"
        placeholder={translate("myStore.Your Instagram username")}
        value={store.instagram!}
        onChange={(value) => onFieldChange("instagram", value)}
        disabled={!isEditing}
        error={fieldErrors.instagram}
      >
        <InstagramIcon size={20} className="fill-primary" />
      </InputText>

      <InputText
        label="Facebook"
        placeholder={translate(
          "myStore.Copy here the URL of your Facebook page",
        )}
        value={store.facebook!}
        onChange={(value) => onFieldChange("facebook", value)}
        disabled={!isEditing}
        error={fieldErrors.facebook}
      >
        <FacebookIcon size={20} className="fill-primary" />
      </InputText>

      <InputText
        label="TikTok"
        placeholder={translate("myStore.Your TikTok username")}
        value={store.tiktok!}
        onChange={(value) => onFieldChange("tiktok", value)}
        disabled={!isEditing}
        error={fieldErrors.tiktok}
      >
        <TikTokIcon size={20} className="fill-primary" />
      </InputText>
    </section>
  );
}