import { useState } from "react";
import { useTranslation } from "react-i18next";

type InputPasswordProps = {
  title: string;
  icon: "lock" | "lock_reset";
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function InputPassword({
  title,
  icon,
  value,
  onChange,
  error,
}: InputPasswordProps) {
  const { t: translate } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex justify-between items-center px-1">
        <label className="text-sm text-text-secondary font-Confortaa">
          {translate(`global.${title}`)}
        </label>
      </div>
      <div className="relative group rounded-lg transition-all duration-200 border-gray-300 text-text-secondary border outline-0 focus-within:border-primary">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-black/30 group-focus-within:text-primary">
          {icon}
        </span>
        <input
          className="w-full h-12 pl-11 pr-12 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-black/30 outline-none font-Confortaa"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id="password"
          name="password"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 transition-colors h-10 w-10 flex items-center justify-center rounded-full cursor-pointer"
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <span className="material-symbols-outlined">
            {showPassword ? "visibility" : "visibility_off"}
          </span>
        </button>
      </div>
      {error ? (
        <span className="text-sm text-red-500 font-Confortaa">{error}</span>
      ) : null}
    </div>
  );
}
