import { useTranslation } from "react-i18next";

type RememberMeProps = {
  value: boolean;
  onClick: (value: boolean) => void;
};

export default function RememberMe({ value, onClick }: RememberMeProps) {
  const { t: translate } = useTranslation();

  return (
    <label
      className="flex items-center gap-2 cursor-pointer group"
      onClick={() => onClick(!value)}
    >
      <div
        className={`size-5  border border-gray-300 rounded-sm ${value ? "bg-primary border-primary" : "bg-white"}`}
      />
      <span className="font-Confortaa text-text-secondary text-sm">
        {translate("login.Remember Me")}
      </span>
    </label>
  );
}
