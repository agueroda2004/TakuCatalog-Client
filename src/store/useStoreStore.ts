import { create } from "zustand";
import type { StoreGlobalContext } from "../types/apiResponse/store";
import { persist, createJSONStorage } from "zustand/middleware";

type StoreState = StoreGlobalContext & {
  setStoreData: (data: StoreGlobalContext) => void;
};

export const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      id: "",
      slug: "",
      name: "",
      color: "",
      currency: "",
      logo: null,
      phoneNumber: "",
      countryCode: "",
      language: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      setStoreData: (data: StoreGlobalContext) =>
        set({
          id: data.id || "",
          slug: data.slug || "",
          name: data.name || "",
          color: data.color || "",
          currency: data.currency || "",
          logo: data.logo || null,
          phoneNumber: data.phoneNumber || "",
          countryCode: data.countryCode || "",
          language: data.language || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          tiktok: data.tiktok || "",
        }),
    }),
    {
      name: "taku-store-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
