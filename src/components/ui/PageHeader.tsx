import { useTranslation } from "react-i18next";

type PageHeaderProps = {
  title: string;
  description: string;
  onClick: () => void;
};

export default function PageHeader({
  title,
  description,
  onClick,
}: PageHeaderProps) {
  const { t: translate } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-4">
      <div>
        <h2 className="text-primary font-semibold text-3xl">
          {translate(title)}
        </h2>
        <p className="max-w-3xl mt-2 text-sm">{translate(description)}</p>
      </div>
      <button
        className="flex items-center gap-2 bg-primary px-4 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md text-white text-sm cursor-pointer"
        onClick={onClick}
      >
        <span className="material-symbols-outlined">add</span>
        {translate("Create")}
      </button>
    </div>
  );
}
