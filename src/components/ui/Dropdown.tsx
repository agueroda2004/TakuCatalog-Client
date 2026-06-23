import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useClickOutside from "../../hooks/useClickOutside";

type CustomDropDownProps = {
  selected?: string;
  options: { text: string; value: string }[];
  placeholder?: string;
  onSelect: (value: string) => void;
};

export default function Dropdown({
  selected,
  options,
  onSelect,
  placeholder,
}: CustomDropDownProps) {
  const { t: translate } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, isOpen, () => setIsOpen(false));

  const selectedOption = options.find((option) => option.value === selected);

  return (
    <div className="relative w-full" ref={menuRef}>
      <div
        className="w-full h-11 px-2 bg-gray-50 border border-gray-200 rounded-lg transition-all outline-none pl-2 flex items-center cursor-pointer text-sm pr-2"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {translate(selectedOption?.text || "")}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {translate(placeholder || "Select an option")}
          </span>
        )}
        <span
          className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
          data-icon="expand_more"
        >
          expand_more
        </span>
      </div>
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 text-sm max-h-40 overflow-y-auto"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${option.value === selected ? "bg-gray-100" : ""}`}
              onClick={() => {
                onSelect(option.value);
              }}
            >
              {translate(option.text)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
