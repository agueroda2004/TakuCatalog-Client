import { useTranslation } from "react-i18next";

export default function VerifyStoreExists() {
  const { t: translate } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col text-black/80 items-center justify-center font-Confortaa">
      <div className="w-full max-w-110 flex flex-col px-5">
        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-xl">
          <div className="mb-lg flex items-center justify-center py-4">
            <span
              className="material-symbols-outlined text-primary animate-bounce"
              style={{ fontSize: "50px" }}
            >
              check_circle
            </span>
          </div>
          <div className="space-y-1 text-center flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {translate("VerifyStoreExists.Verifying your store")}
            </h1>
            <p className="text-black/80 text-xs">
              {translate(
                "VerifyStoreExists.We are checking if your store exists",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
