import { useTranslation } from "react-i18next";
import { COLORS } from "../../../constants/data";
import { useStoreStore } from "../../../store/useStoreStore";
import { useState, type ChangeEvent } from "react";

type ColorSelectorProps = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  addNewColor: boolean;
  setAddNewColor: (value: boolean) => void;
  error?: string | null;
};

export default function ColorSelector({
  selectedColor,
  setSelectedColor,
  addNewColor,
  setAddNewColor,
  error,
}: ColorSelectorProps) {
  const { t: translate } = useTranslation();
  const { color } = useStoreStore();

  const selectedColorExists = COLORS.includes(selectedColor);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedColor(value);
  };

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <div className="grid grid-cols-8 md:grid-cols-8 gap-1 w-full">
        {!selectedColorExists && (
          <button
            aria-label="Teal"
            className={`w-full aspect-square border border-gray-100 rounded-lg cursor-pointer transition-transform active:scale-90 ${selectedColor === color ? "" : "scale-90"} `}
            style={{ backgroundColor: selectedColor }}
            onClick={() => {
              setSelectedColor(selectedColor);
            }}
          ></button>
        )}
        {COLORS.map((color) => (
          <button
            aria-label="Teal"
            key={color}
            className={`w-full aspect-square rounded-lg cursor-pointer transition-transform active:scale-90 ${selectedColor === color ? "scale-90" : ""} `}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          ></button>
        ))}
        <div
          className="relative w-full aspect-square rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 cursor-pointer"
          onClick={() => setAddNewColor(!addNewColor)}
        >
          <span className="material-symbols-outlined text-slate-400">
            palette
          </span>
        </div>
      </div>
      {addNewColor && (
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-semibold">
            {translate("createStore.Color Hex Code")}
          </label>
          <input
            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm "
            placeholder={translate("createStore.Example #1d4ed8")}
            type="text"
            maxLength={7}
            value={selectedColor}
            onChange={handleHexChange}
          />
          {error && (
            <span className="text-red-500 text-sm">
              {translate(`createStore.${error}`)}
            </span>
          )}
        </div>
      )}
      <div className="p-6 rounded-lg bg-slate-50 border border-gray-200 w-full">
        <span className="text-sm block mb-2">
          {translate("createStore.Live Preview")}
        </span>
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col gap-4 shadow-sm">
          <div className="h-32 w-full bg-slate-100 rounded-lg overflow-hidden relative">
            <img
              className="w-full h-full object-cover"
              data-alt="A professional studio product shot of a sleek, white minimalist watch on a soft grey background. The lighting is crisp and even, emphasizing clean lines and high-quality craftsmanship, reflecting a modern corporate aesthetic. Subtle shadows add depth without cluttering the frame, maintaining a calm-tech and efficient visual environment."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5FEnqan47OZb1na9RY0-SJXD0j6d-Sye4xeWW22ucjzjo0DS2AOm0SQeMJT6gPViSZ-OAPp9L19BZE8qTBHBwlzWa3GmipWHIE1Nn68vmPTzUFsWBvZ5RaVG3qpmoh0gAhrdhXrYlt2UsozoxbV0f4DUp3dm7O1xfBE_J7mAhGfhXCRndNhe0Tdr8ohqx5pgLi0cXPPd1OwBwabTDFDYu2At-oDfNVBr6CAKr8UxwZpDCJRhI5O5880HIAqcElGEhYUSrSkl2vR2Z"
            />
          </div>
          <div>
            <h3 className="text-md">
              {translate("createStore.Executive Minimalist Watch")}
            </h3>
            <p className="text-xs">
              {translate("createStore.Professional Alpha Series")}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`font-bold text-${selectedColor} text-md`}
              id="preview-price"
              style={{ color: selectedColor }}
            >
              $249.00
            </span>
            <button
              className={`bg-${selectedColor} text-white px-4 py-2 rounded-lg text-xs preview-transition active:scale-95 transition-all`}
              id="preview-button"
              style={{ backgroundColor: selectedColor }}
            >
              {translate("createStore.View Product")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
