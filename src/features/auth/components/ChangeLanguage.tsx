import { useRef, useState } from "react";
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";
import useClickOutside from "../../../hooks/useClickOutside";

const LANGUAGES = [
  { code: "es", label: "Spanish" },
  { code: "en", label: "English" },
];

/**
 * Component to manage the language change in Auth Layout.
 */
export default function ChangeLanguage() {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const selectedLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleChangeLanguage = (lang: (typeof LANGUAGES)[0]) => {
    setIsOpen(false);
    i18n.changeLanguage(lang.code);
  };

  useClickOutside(menuRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={menuRef} className="relative font-Confortaa">
      {/* Begin of Language Selector */}
      <div
        className={`${isOpen ? "text-primary/80" : ""} flex items-center gap-2 justify-center cursor-pointer group hover:bg-primary-container/10 px-3 py-1.5 transition-all text-black/60 text-md`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[20px]"
          data-icon="language"
        >
          language
        </span>
        <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">
          {t(`global.${selectedLanguage.label}`)}
        </span>
        <span
          className="material-symbols-outlined text-on-surface-variant group-hover:text-primary"
          data-icon="keyboard_arrow_down"
        >
          keyboard_arrow_down
        </span>
      </div>
      {/* End of Language Selector */}

      {/* Begin of Language Menu */}
      {isOpen && (
        <div className="absolute w-full border top-full border-gray-300 bg-white rounded-lg shadow-md flex flex-col z-10 text-sm overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`w-full px-5 py-2 text-left hover:bg-gray-100 transition-colors cursor-pointer ${lang.code === selectedLanguage.code ? "bg-gray-100" : ""}`}
              onClick={async (e) => {
                e.stopPropagation();
                handleChangeLanguage(lang);
              }}
            >
              {t(`global.${lang.label}`)}
            </button>
          ))}
        </div>
      )}
      {/* End of Language Menu */}
    </div>
  );
}
