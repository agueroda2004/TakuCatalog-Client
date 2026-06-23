import { useState } from "react";
import FormStepOne from "../components/FormStepOne";
import MoveButtons from "../components/MoveButtons";
import Progress from "../components/Progress";
import FormStepTwo from "../components/FormStepTwo";
import FormStepThree from "../components/FormStepThree";
import { StoreSchema } from "../../../schemas/store.schema";
import { COUNTRY_CODES } from "../../../constants/data";
import useStore from "../hooks/useStore";
import useUploadImage from "../../../hooks/useUploadImage";
import { upload } from "@imagekit/react";
import { useNavigate } from "react-router";
import { logError } from "../../../utils/logError";
import toast from "react-hot-toast";
import CustomToast from "../../../components/CustomToast";
import { useTranslation } from "react-i18next";
import type { ApiError } from "../../../utils/ApiError";
import i18n from "../../../i18n";
import { useStoreStore } from "../../../store/useStoreStore";

/**
 * Type to manage the direction of the animation when transitioning between steps.
 */
type Direction = "enter" | "exit" | "visible";

/**
 * Type to manage errors for all steps. It allows us to store errors for each step separately, making it easier to display them in the UI and handle validation logic.
 */
type AllStepErrors = {
  // Step 1
  1?: {
    name?: string[];
    currencyCode?: string[];
    logoFile?: string[];
  };
  // Step 2
  2?: {
    color?: string[];
  };
  // Step 3
  3?: {
    slug?: string[];
    phoneNumber?: string[];
    instagram?: string[];
    facebook?: string[];
    tiktok?: string[];
  };
};

/**
 * Step validators for each step of the form. They are based on the Zod schemas defined in store.schema.ts
 */
const stepValidators: Record<number, any> = {
  // Step 1
  1: StoreSchema.stepOne,
  // Step 2
  2: StoreSchema.stepTwo,
  // Step 3
  3: StoreSchema.stepThree,
};

type Store = {
  color: string;
  name: string;
  slug: string;
  currencyCode: string;
  logoFile: File | null;
  logoPreview: string | null;
  countryCode: string;
  phoneNumber: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  language: string;
};

export default function CreateStore() {
  const { setStoreData } = useStoreStore();
  const { t: translate } = useTranslation();
  const { createStore, isCreating, updateLogo } = useStore();
  const { getImageKitAuth } = useUploadImage();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<Direction>("visible");
  const [store, setStore] = useState<Store>({
    color: "#1d4ed8",
    name: "",
    slug: "",
    currencyCode: "",
    logoFile: null,
    logoPreview: null,
    countryCode: COUNTRY_CODES[0].code,
    phoneNumber: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    language: i18n.language,
  });
  const [errors, setErrors] = useState<AllStepErrors>({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof Store, value: any) => {
    setStore((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Helper function to validate the current step's data using the corresponding Zod schema.
   * @param step - Current step number (1, 2, or 3)
   * @param data - Data to validate for the current step
   */
  const validateStep = (step: number, data: any) => {
    const validator = stepValidators[step];
    const result = validator.safeParse(data);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [step]: result.error.flatten().fieldErrors,
      }));
      return false;
    }
    clearStepErrors(step);
    return true;
  };

  /**
   * Helper function to clear errors for a specific step.
   * @param step - Current step number (1, 2, or 3)
   */
  const clearStepErrors = (step: number) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (step === 1) delete newErrors[1];
      if (step === 2) delete newErrors[2];
      if (step === 3) delete newErrors[3];
      return newErrors;
    });
  };

  const onErrorUploadLogo = () => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        success={false}
        title="Error"
        message={translate("createStore.Logo Upload Failed")}
      />
    ));
    navigate(`/dashboard/`);
    return;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let logo = { url: "", fileId: "" };
    try {
      const result = await createStore(store);

      if (store.logoFile) {
        try {
          const auth = await getImageKitAuth(result.data.id, "logo");

          if (!auth) {
            onErrorUploadLogo();
            return;
          }

          const logoImageKit = await upload({
            file: store.logoFile,
            ...auth.data,
          });

          if (!logoImageKit.url || !logoImageKit.fileId) {
            onErrorUploadLogo();
            return;
          }

          logo = { url: logoImageKit.url, fileId: logoImageKit.fileId };

          await updateLogo({
            storeId: result.data.id,
            logoUrl: logoImageKit.url,
            fileId: logoImageKit.fileId,
          });
        } catch (error) {
          logError(error, "Error uploading store logo");
          onErrorUploadLogo();
        }
      }
      toast.custom((t) => (
        <CustomToast
          t={t}
          success={true}
          title="Success"
          message={translate("createStore.Store Created Successfully")}
        />
      ));
      setStoreData({
        ...result.data,
        logo: { url: logo.url, fileId: logo.fileId },
      });

      navigate(`/dashboard`);
    } catch (error) {
      logError(error, "Error creating store");
      const errorMessage = (error as ApiError)?.message;
      toast.custom((t) => (
        <CustomToast
          t={t}
          success={false}
          title="Error"
          message={errorMessage || translate("createStore.Create Store Failed")}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper function to manage the animation when transitioning between steps.
   * @param nextStep - Callback function to set the next step after the exit animation is complete
   */
  const animate = (nextStep: () => void) => {
    setDirection("exit");
    setTimeout(() => {
      nextStep();
      setDirection("enter");
      setTimeout(() => setDirection("visible"), 50);
    }, 300);
  };

  const handleNextStep = () => {
    const stepData: Record<number, any> = {
      // Step 1
      1: {
        name: store.name,
        currencyCode: store.currencyCode,
        logoFile: store.logoFile,
      },
      // Step 2
      2: { color: store.color },
      // Step 3
      3: {
        slug: store.slug,
        phoneNumber: store.phoneNumber,
        instagram: store.instagram,
        facebook: store.facebook,
        tiktok: store.tiktok,
      },
    };

    if (!validateStep(step, stepData[step])) return;

    if (step === 3) {
      handleSubmit();
    } else {
      animate(() => setStep(step + 1));
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      animate(() => setStep(step - 1));
    }
  };

  const animationClass =
    direction === "visible"
      ? "translate-x-0 opacity-100"
      : direction === "exit"
        ? "-translate-x-10 opacity-0"
        : "translate-x-10 opacity-0";

  return (
    <>
      <Progress currentStep={step} />
      <div
        className={`transition-all duration-300 ease-in-out ${animationClass}`}
      >
        {step === 1 && (
          <FormStepOne
            storeName={store.name}
            setStoreName={(value) => handleChange("name", value)}
            currencyCode={store.currencyCode}
            setCurrencyCode={(value) => handleChange("currencyCode", value)}
            logoFile={store.logoFile}
            setLogoFile={(value) => handleChange("logoFile", value)}
            logoPreview={store.logoPreview}
            setLogoPreview={(value) => handleChange("logoPreview", value)}
            errors={errors[1]}
          />
        )}
        {step === 2 && (
          <FormStepTwo
            selectedColor={store.color}
            setSelectedColor={(value) => handleChange("color", value)}
            errors={errors[2]}
          />
        )}
        {step === 3 && (
          <FormStepThree
            storeUrl={store.slug}
            setStoreUrl={(value) => handleChange("slug", value)}
            countryCode={store.countryCode}
            setCountryCode={(value) => handleChange("countryCode", value)}
            phoneNumber={store.phoneNumber}
            setPhoneNumber={(value) => handleChange("phoneNumber", value)}
            instagram={store.instagram}
            setInstagram={(value) => handleChange("instagram", value)}
            facebook={store.facebook}
            setFacebook={(value) => handleChange("facebook", value)}
            tiktok={store.tiktok}
            setTiktok={(value) => handleChange("tiktok", value)}
            errors={errors[3]}
          />
        )}
      </div>
      <MoveButtons
        onNext={handleNextStep}
        onBack={handleBackStep}
        step={step}
      />
    </>
  );
}
