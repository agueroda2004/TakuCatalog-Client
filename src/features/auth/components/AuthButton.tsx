import { useTranslation } from "react-i18next";
import LoadingSpin from "../../../components/LoadingSpin";

type AuthButtonProps = {
  text: string;
  isLoading?: boolean;
};

export default function AuthButton({ text, isLoading }: AuthButtonProps) {
  const { t: translate } = useTranslation();
  return (
    <button
      className="w-full h-12 mt-2 bg-primary text-on-primary text-label-md rounded-lg shadow-md font-Confortaa hover:bg-primary-container active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-white text-md cursor-pointer"
      type="submit"
      disabled={isLoading}
    >
      {translate(`global.${text}`)}
      <span className="material-symbols-outlined text-sm" data-icon="login">
        {isLoading ? <LoadingSpin color="#FFFFFF" /> : "login"}
      </span>
    </button>
  );
}
