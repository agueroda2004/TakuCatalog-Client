import { useStoreStore } from "../../../store/useStoreStore";
import { COUNTRY_CODES, CURRENCIES, LANGUAGES } from "../../../constants/data";
import Button from "../../../components/global/Button";
import Title from "../../../components/global/Title";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import CustomToast from "../../../components/CustomToast";
import useStoreForm from "../hooks/useStoreForm";
import StoreDetailsSection from "../components/StoreDetailsSection";
import GlobalSettingsSection from "../components/GlobalSettingsSection";
import AppearanceSection from "../components/AppearanceSection";
import SocialMediaSection from "../components/SocialMediaSection";
import { FLAG_SVG } from "../../../components/global/CountryFlags";
import type { JSX } from "react";

const FLAG_COMPONENTS: Record<string, () => JSX.Element> = {
  "+506": FLAG_SVG.CR,
  "+1": FLAG_SVG.USA,
  "+52": FLAG_SVG.MX,
};

export default function MyStore() {
  const { logo } = useStoreStore();
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const {
    handleStartEditing,
    handleChangeStoreField,
    handleLogoChange,
    handleLanguageChange,
    handleCancel,
    handlePhoneChange,
    handleSubmit,
    isEditing,
    isUpdating,
    fieldErrors,
    addNewColor,
    store,
    setAddNewColor,
  } = useStoreForm();

  const countryCodeOptions = useMemo(
    () =>
      COUNTRY_CODES.map((c) => {
        const Flag = FLAG_COMPONENTS[c.code];
        return {
          text: c.code,
          value: c.code,
          prefix: Flag ? <Flag /> : null,
        };
      }),
    [],
  );

  const languageOptions = useMemo(
    () =>
      LANGUAGES.map((lang) => ({
        text: translate(`global.${lang.label}`),
        value: lang.code,
      })),
    [translate],
  );

  const currencyOptions = useMemo(
    () =>
      CURRENCIES.map((currency) => ({
        text: `${translate(`currency.${currency.name}`)} (${currency.code})`,
        value: currency.code,
      })),
    [translate],
  );

  useEffect(() => {
    return () => {
      if (store.logoPreview && store.logoFile === null) {
        URL.revokeObjectURL(store.logoPreview);
      }
    };
  }, [store.logoPreview, store.logoFile]);

  const onSubmit = async () => {
    const result = await handleSubmit();

    if (result.success) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Success"
          success={true}
          message="Store updated successfully."
        />
      ));
      navigate("/redirect");
      return;
    }

    if (result.noChanges) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Success"
          success={true}
          message="No changes detected."
        />
      ));
      return;
    }

    if (result.fieldErrors) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Validation Error"
          success={false}
          message="Please fix the errors in the form."
        />
      ));
      return;
    }

    if (result.error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Error"
          success={false}
          message={result.error as string}
        />
      ));
    }
  };

  return (
    <main className="max-w-4xl flex flex-col gap-6">
      <Title
        title={translate("myStore.System Preferences")}
        description={translate(
          "myStore.Manage your store's settings and customize your catalog's appearance.",
        )}
      />

      <div className="flex flex-row gap-2 w-full justify-start">
        {!isEditing ? (
          <Button
            className="px-5 bg-primary"
            onClick={handleStartEditing}
            text={translate(`myStore.Edit`)}
          />
        ) : (
          <>
            <Button
              onClick={onSubmit}
              text={translate("myStore.Save")}
              className="bg-primary px-5"
              isLoading={isUpdating}
              isLoadingText={translate("myStore.Saving")}
            />
            <Button
              onClick={handleCancel}
              text={translate("myStore.Cancel")}
              className="bg-gray-400 px-5"
            />
          </>
        )}
      </div>

      <StoreDetailsSection
        store={store}
        fieldErrors={fieldErrors}
        isEditing={isEditing}
        onFieldChange={handleChangeStoreField}
      />

      <GlobalSettingsSection
        store={store}
        fieldErrors={fieldErrors}
        isEditing={isEditing}
        languageOptions={languageOptions}
        currencyOptions={currencyOptions}
        onLanguageChange={handleLanguageChange}
        onFieldChange={handleChangeStoreField}
      />

      <AppearanceSection
        store={store}
        isEditing={isEditing}
        addNewColor={addNewColor}
        setAddNewColor={setAddNewColor}
        colorError={fieldErrors.color}
        onFieldChange={handleChangeStoreField}
        onLogoChange={handleLogoChange}
        logoUrl={logo?.url}
      />

      <SocialMediaSection
        store={store}
        fieldErrors={fieldErrors}
        isEditing={isEditing}
        countryCodeOptions={countryCodeOptions}
        onFieldChange={handleChangeStoreField}
        onPhoneChange={handlePhoneChange}
      />
    </main>
  );
}
