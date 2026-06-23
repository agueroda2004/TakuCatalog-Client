import { useTranslation } from "react-i18next";

type InputEmailProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function InputEmail({
  value,
  onChange,
  error,
}: InputEmailProps) {
  const { t: translate } = useTranslation();

  return (
    <div className="flex flex-col gap-1 mb-2">
      <label className="text-sm text-text-secondary font-Confortaa">
        {translate("global.Email")}
      </label>
      <div className="relative group rounded-lg transition-all duration-200 border-gray-300 text-text-secondary border outline-0 focus-within:border-primary">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-black/30 group-focus-within:text-primary">
          mail
        </span>
        <input
          className="w-full h-12 pl-11 pr-4 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-black/30 outline-none font-Confortaa"
          type="text"
          autoComplete="off"
          placeholder={translate("global.emailExample")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error ? (
        <span className="text-sm text-red-500 font-Confortaa">{error}</span>
      ) : null}
    </div>
  );
}
