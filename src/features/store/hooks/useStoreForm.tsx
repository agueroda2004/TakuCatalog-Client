import { useState } from "react";
import type { Store, UpdateStoreDTO } from "../../../types/apiResponse/store";
import { useStoreStore } from "../../../store/useStoreStore";
import { COUNTRY_CODES } from "../../../constants/data";
import i18n from "../../../i18n";
import { formatPhoneNumber } from "../../../utils/phoneUtils";
import { StoreSchema } from "../../../schemas/store.schema";
import useUploadImage from "../../../hooks/useUploadImage";
import { upload } from "@imagekit/react";
import useStore from "./useStore";
import { logError } from "../../../utils/logError";
import { ApiError } from "../../../utils/ApiError";

type StoreFieldValue = string | File | null;

type SubmitResult =
  | { success: true }
  | {
      success: false;
      noChanges?: true;
      fieldErrors?: Record<string, string>;
      error?: string;
    };

export default function useStoreForm() {
  const {
    id: storeId,
    logo,
    currency,
    color,
    name,
    slug,
    phoneNumber,
    countryCode,
    language,
    instagram,
    facebook,
    tiktok,
  } = useStoreStore();
  const { getImageKitAuth } = useUploadImage();
  const { updateStore, isUpdating, deleteLogo } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [addNewColor, setAddNewColor] = useState(false);
  const [initialStoreState, setInitialStoreState] = useState<Store | null>(
    null,
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [store, setStore] = useState<Store>({
    color: color || "#1d4ed8",
    name: name || "",
    slug: slug || "",
    currency: currency || "",
    logoFile: null,
    logoPreview: null,
    countryCode: countryCode || COUNTRY_CODES[0].code,
    phoneNumber: phoneNumber || "",
    instagram: instagram || "",
    facebook: facebook || "",
    tiktok: tiktok || "",
    language: language || i18n.language,
  });

  const handleChangeStoreField = (
    field: keyof Store,
    value: StoreFieldValue,
  ) => {
    setStore((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleStartEditing = () => {
    setInitialStoreState({
      color: color || "#1d4ed8",
      name: name || "",
      slug: slug || "",
      currency: currency || "",
      logoFile: null,
      logoPreview: null,
      countryCode: countryCode || COUNTRY_CODES[0].code,
      phoneNumber: phoneNumber || "",
      instagram: instagram || "",
      facebook: facebook || "",
      tiktok: tiktok || "",
      language: language,
    });
    setIsEditing(true);
  };

  const handleLogoChange = (file: File) => {
    const prevLogoPreview = store.logoPreview;
    handleChangeStoreField("logoFile", file);
    setStore((prev) => ({ ...prev, logoPreview: URL.createObjectURL(file) }));
    if (prevLogoPreview) {
      URL.revokeObjectURL(prevLogoPreview);
    }
  };

  const handleCancel = () => {
    if (initialStoreState) {
      setStore(initialStoreState);
    }
    i18n.changeLanguage(initialStoreState?.language || i18n.language);
    setIsEditing(false);
    setAddNewColor(false);
    setFieldErrors({});
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, store.countryCode);
    handleChangeStoreField("phoneNumber", formatted);
  };

  const handleSubmit = async (): Promise<SubmitResult> => {
    if (!isEditing) {
      return { success: false, error: "Not in editing mode" };
    }

    const hasChanges =
      JSON.stringify(store) !== JSON.stringify(initialStoreState);

    if (!hasChanges) {
      setIsEditing(false);
      return { success: false, noChanges: true };
    }

    const result = StoreSchema.updateStore.safeParse(store);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          errors[path] = issue.message;
        }
      });
      setFieldErrors(errors);
      return { success: false, fieldErrors: errors };
    }

    try {
      const dataToSend: UpdateStoreDTO = {};
      if (store.name !== initialStoreState?.name) dataToSend.name = store.name;
      if (store.slug !== initialStoreState?.slug) dataToSend.slug = store.slug;
      if (store.phoneNumber !== initialStoreState?.phoneNumber)
        dataToSend.phoneNumber = store.phoneNumber;
      if (store.color !== initialStoreState?.color)
        dataToSend.color = store.color;
      if (store.instagram !== initialStoreState?.instagram)
        dataToSend.instagram = store.instagram;
      if (store.facebook !== initialStoreState?.facebook)
        dataToSend.facebook = store.facebook;
      if (store.tiktok !== initialStoreState?.tiktok)
        dataToSend.tiktok = store.tiktok;
      if (store.currency !== initialStoreState?.currency)
        dataToSend.currency = store.currency;
      if (store.countryCode !== initialStoreState?.countryCode)
        dataToSend.countryCode = store.countryCode;
      if (store.language !== initialStoreState?.language)
        dataToSend.language = store.language;

      if (store.logoFile) {
        const authImageKit = await getImageKitAuth(storeId, "logo");

        if (!authImageKit) {
          return {
            success: false,
            error: "Failed to get image upload credentials",
          };
        }

        const uploadImage = await upload({
          file: store.logoFile,
          ...authImageKit.data,
        });

        if (!uploadImage.url || !uploadImage.fileId) {
          return { success: false, error: "Image upload failed" };
        }

        dataToSend.logo = {
          url: uploadImage.url,
          fileId: uploadImage.fileId,
        };
      }

      const updateResult = await updateStore(dataToSend);

      if (!updateResult.success) {
        return { success: false, error: "Failed to update store" };
      }

      if (
        store.logoFile &&
        initialStoreState?.logoFile === null &&
        logo?.fileId
      ) {
        try {
          await deleteLogo(logo.fileId);
        } catch (err) {
          logError(err, "Error deleting old logo from ImageKit");
        }
      }

      return { success: true };
    } catch (error) {
      logError(error, "Error updating store");
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  return {
    store,
    isEditing,
    setIsEditing,
    initialStoreState,
    setInitialStoreState,
    fieldErrors,
    setFieldErrors,
    addNewColor,
    setAddNewColor,
    handleChangeStoreField,
    handleStartEditing,
    handleLogoChange,
    handleCancel,
    handleLanguageChange,
    handlePhoneChange,
    handleSubmit,
    isUpdating,
  };
}
