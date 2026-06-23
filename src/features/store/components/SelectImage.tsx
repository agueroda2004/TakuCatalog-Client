import { useTranslation } from "react-i18next";

type SelectImageProps = {
  previewUrl: string | undefined;
  onImageSelect: (file: File) => void;
  error?: string;
  title?: string;
  subtitle?: string;
  errorNamespace?: string;
};

export default function SelectImage({
  previewUrl,
  onImageSelect,
  error,
  title = "createStore.Upload Logo",
  subtitle = "createStore.Supports PNG, JPG (Max. 5MB)",
  errorNamespace = "createStore",
}: SelectImageProps) {
  const { t: translate } = useTranslation();
  return (
    <div className="flex flex-col gap-1 size-full">
      <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-primary/70 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden size-full">
        <input
          className="absolute size-full opacity-0 cursor-pointer z-10"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onImageSelect(e.target.files[0]);
            }
          }}
        />
        <div className="flex flex-col items-center text-center gap-2">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="size-80 rounded-lg object-cover"
            />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "24px" }}
                >
                  add_photo_alternate
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">
                  {translate(title)}
                </p>
                <p className="text-xs">{translate(subtitle)}</p>
              </div>
            </>
          )}
        </div>
      </div>
      {error && (
        <span className="text-red-500 text-sm">
          {translate(`${errorNamespace}.${error}`)}
        </span>
      )}
    </div>
  );
}