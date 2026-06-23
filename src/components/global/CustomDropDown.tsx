import { type ReactNode, useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { useTranslation } from "react-i18next";

type CustomDropDownProps = {
  selectedValue?: string;
  options: { text: string; value: string; prefix?: ReactNode }[];
  onSelect: (value: string) => void;
  label?: string;
};

export default function CustomDropDown({
  options,
  onSelect,
  selectedValue,
  label,
}: CustomDropDownProps) {
  const { t: translate } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  useClickOutside(menuRef, isOpen, () => setIsOpen(false));

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div className="relative" ref={menuRef}>
        <div
          className="w-full h-11 px-md appearance-none bg-surface border border-gray-200 rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none pl-2 flex items-center cursor-pointer text-sm pr-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.prefix && (
                <span className="flex items-center gap-2 w-6 h-full overflow-hidden">
                  {selectedOption.prefix}
                </span>
              )}

              {selectedOption.text}
            </span>
          ) : (
            translate("global.Select an option")
          )}
          <span
            className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
            data-icon="expand_more"
          >
            expand_more
          </span>
        </div>
        {isOpen && (
          <div
            className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 text-sm"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${option.value === selectedValue ? "bg-gray-100" : ""}`}
                onClick={() => {
                  onSelect(option.value);
                }}
              >
                {option.prefix && (
                  <span className="flex items-center gap-2 w-6 h-full overflow-hidden">
                    {option.prefix}
                  </span>
                )}
                {option.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
