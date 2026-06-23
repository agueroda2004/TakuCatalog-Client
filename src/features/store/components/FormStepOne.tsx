import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SelectImage from "./SelectImage";
import CustomDropDown from "../../../components/global/CustomDropDown";
import { CURRENCIES } from "../../../constants/data";

/**
 * Type to manage errors for step one of the form.
 */
type FormStepOneErrors = {
  name?: string[];
  currencyCode?: string[];
  logoFile?: string[];
};

type FormStepOneProps = {
  storeName: string;
  setStoreName: (value: string) => void;
  currencyCode: string;
  setCurrencyCode: (value: string) => void;
  logoFile: File | null;
  setLogoFile: (file: File) => void;
  logoPreview: string | null;
  setLogoPreview: (url: string | null) => void;
  errors?: FormStepOneErrors;
};

export default function FormStepOne({
  storeName,
  setStoreName,
  currencyCode,
  setCurrencyCode,
  logoFile,
  setLogoFile,
  logoPreview,
  setLogoPreview,
  errors,
}: FormStepOneProps) {
  const { t: translate } = useTranslation();

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  // Avoid memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview && logoFile === null) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, logoFile]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm max-w-120">
      {/* Start: Header */}
      <div className="mb-8">
        <h1 className="font-Confortaa text-xl mb-3 font-semibold">
          {translate("createStore.Configure Your Store")}
        </h1>
        <p className="text-sm max-w-100">
          {translate(
            "createStore.Get Started with basics and you can always change it later",
          )}
        </p>
      </div>
      {/* End: Header */}

      {/* Start: Form */}
      <form className="space-y-6">
        {/* Start: Store Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">
            {translate("createStore.Store Name")}
          </label>
          <input
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
            placeholder={translate("createStore.Enter Store Name")}
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          {errors?.name && (
            <span className="text-red-500 text-sm">
              {translate(`createStore.${errors.name[0]}`)}
            </span>
          )}
        </div>
        {/* End: Store Name */}

        {/* Start: Currency Code */}
        <div className="flex flex-col gap-1">
          <CustomDropDown
            options={CURRENCIES.map((currency) => ({
              text: `${translate(`currency.${currency.name}`)} (${currency.code})`,
              value: currency.code,
            }))}
            onSelect={(value) => setCurrencyCode(value)}
            selectedValue={currencyCode}
          />
          {errors?.currencyCode && (
            <span className="text-red-500 text-sm">
              {translate(`createStore.${errors.currencyCode[0]}`)}
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
              "createStore.This is the currency that will be used in your store.",
            )}
          </p>
        </div>
        {/* End: Currency Code */}

        <SelectImage
          onImageSelect={(file) => handleLogoChange(file)}
          previewUrl={logoPreview}
          error={errors?.logoFile ? errors.logoFile[0] : undefined}
        />
      </form>
      {/* End: Form */}
    </div>
  );
}
