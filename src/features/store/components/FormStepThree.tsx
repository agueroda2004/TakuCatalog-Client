import CustomDropDown from "../../../components/global/CustomDropDown";
import { FLAG_SVG } from "../../../components/global/CountryFlags";
import { COUNTRY_CODES } from "../../../constants/data";
import {
  getPhonePlaceholder,
  formatPhoneNumber,
  getMaxDigits,
} from "../../../utils/phoneUtils";
import { useTranslation } from "react-i18next";
import type { JSX } from "react";

/**
 * Type to manage errors for step three of the form.
 */
type FormStepThreeErrors = {
  slug?: string[];
  phoneNumber?: string[];
  instagram?: string[];
  facebook?: string[];
  tiktok?: string[];
};

type FormStepThreeProps = {
  storeUrl: string;
  setStoreUrl: (value: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  instagram?: string;
  setInstagram: (value: string) => void;
  facebook?: string;
  setFacebook: (value: string) => void;
  tiktok?: string;
  setTiktok: (value: string) => void;
  errors?: FormStepThreeErrors;
};

const FLAG_COMPONENTS: Record<string, () => JSX.Element> = {
  "+506": FLAG_SVG.CR,
  "+1": FLAG_SVG.USA,
  "+52": FLAG_SVG.MX,
};

export default function FormStepThree({
  storeUrl,
  setStoreUrl,
  errors,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  instagram,
  setInstagram,
  facebook,
  setFacebook,
  tiktok,
  setTiktok,
}: FormStepThreeProps) {
  const { t: translate } = useTranslation();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, countryCode);
    setPhoneNumber(formatted);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm max-w-120">
      {/* Start: Header */}
      <div className="mb-8">
        <h1 className="text-xl mb-3 font-semibold">
          {translate("createStore.Connect with your customers")}
        </h1>
        <p className="text-sm max-w-100">
          {translate(
            "createStore.Link your profiles so customers can easily contact you and follow you",
          )}
        </p>
      </div>
      {/* End: Header */}

      {/* Start: Form */}
      <form className="space-y-6">
        {/* Start: Store URL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            {translate("createStore.Store URL")}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 pointer-events-none text-sm">
              {translate("createStore.Store URL Prefix")}
            </span>
            <input
              className="w-full h-12 pl-37 pr-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              placeholder={translate("createStore.your-store-url")}
              type="text"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
            />
          </div>
          {errors?.slug && (
            <span className="text-red-500 text-sm">
              {translate(`createStore.${errors.slug[0]}`)}
            </span>
          )}
          <p className="text-xs flex items-center gap-2 text-gray-400">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              info
            </span>
            {translate(
              "createStore.This is the web address you will share with your customers.",
            )}
          </p>
        </div>
        {/* End: Store URL */}

        {/* Start: WhatsApp */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            {translate("createStore.WhatsApp")}
          </label>
          <div className="flex gap-2">
            <div className="w-28">
              <CustomDropDown
                options={COUNTRY_CODES.map((c) => {
                  const Flag = FLAG_COMPONENTS[c.code];
                  return {
                    text: c.code,
                    value: c.code,
                    prefix: Flag ? <Flag /> : null,
                  };
                })}
                onSelect={(value) => {
                  setCountryCode(value);
                  setPhoneNumber("");
                }}
                selectedValue={countryCode}
              />
            </div>
            <div className="relative flex flex-1 flex-col gap-1">
              <input
                className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm pl-2"
                id="whatsapp"
                placeholder={getPhonePlaceholder(countryCode)}
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={getMaxDigits(countryCode) + 3}
              />
              {errors?.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {translate(`createStore.${errors.phoneNumber[0]}`)}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* End: WhatsApp */}

        {/* Start: Instagram */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            {translate("createStore.Instagram")}
          </label>
          <div className="relative flex items-center">
            <img
              src="icons/instagram.svg"
              alt="Instagram"
              className="absolute left-3 size-5 pointer-events-none"
            />
            <input
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm pl-10"
              id="instagram"
              placeholder={translate("createStore.Instagram username")}
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            {errors?.instagram && (
              <span className="text-red-500 text-sm">
                {translate(`createStore.${errors.instagram[0]}`)}
              </span>
            )}
          </div>
        </div>
        {/* End: Instagram */}

        {/* Start: Facebook */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            {translate("createStore.Facebook")}
          </label>
          <div className="relative flex items-center">
            <img
              src="icons/facebook.svg"
              alt="Facebook"
              className="absolute left-3 size-5 pointer-events-none"
            />
            <input
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm pl-10"
              id="facebook"
              placeholder={translate("createStore.Facebook page URL")}
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
            {errors?.facebook && (
              <span className="text-red-500 text-sm">
                {translate(`createStore.${errors.facebook[0]}`)}
              </span>
            )}
          </div>
        </div>
        {/* End: Facebook */}

        {/* Start: TikTok */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            {translate("createStore.TikTok")}
          </label>
          <div className="relative flex items-center">
            <img
              src="icons/tiktok.svg"
              alt="TikTok"
              className="absolute left-3 size-5 pointer-events-none"
            />
            <input
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm pl-10"
              id="tiktok"
              placeholder={translate("createStore.TikTok username")}
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
            />
            {errors?.tiktok && (
              <span className="text-red-500 text-sm">
                {translate(`createStore.${errors.tiktok[0]}`)}
              </span>
            )}
          </div>
        </div>
        {/* End: TikTok */}
      </form>
      {/* End: Form */}
    </div>
  );
}
