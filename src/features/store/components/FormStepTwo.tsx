import { useTranslation } from "react-i18next";
import { COLORS } from "../../../constants/data";
import { useState, type ChangeEvent } from "react";

/**
 * Type to manage errors for step two of the form.
 */
type FormStepTwoErrors = {
  color?: string[];
};

type FormStepTwoProps = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  errors?: FormStepTwoErrors;
};

export default function FormStepTwo({
  selectedColor,
  setSelectedColor,
  errors,
}: FormStepTwoProps) {
  const { t: translate } = useTranslation();
  const [addNewColor, setAddNewColor] = useState(false);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedColor(value);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm max-w-120">
      {/* Start: Header */}
      <div className="mb-8">
        <h1 className="text-xl mb-3 font-semibold">
          {translate("createStore.Customize Your Style")}
        </h1>
        <p className="text-sm max-w-100">
          {translate("createStore.Define The Visual Identity")}
        </p>
      </div>
      {/* End: Header */}

      {/* Start: Main Content */}
      <div className="space-y-6">
        {/* Start: Color Selection */}
        <div>
          <label className="text-sm font-semibold">
            {translate("createStore.Primary Color")}
          </label>
          <div className="grid grid-cols-8 mb-md gap-1">
            {COLORS.map((color) => (
              <button
                aria-label="Teal"
                className={`w-full aspect-square rounded-lg cursor-pointer transition-transform active:scale-90 ${selectedColor === color ? "scale-90" : ""} `}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></button>
            ))}
            <div
              className="relative w-full aspect-square rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 cursor-pointer"
              onClick={() => setAddNewColor((prev) => !prev)}
            >
              <span className="material-symbols-outlined text-slate-400">
                palette
              </span>
            </div>
          </div>
        </div>
        {/* End: Color Selection */}

        {/* Start: Custom Color Input */}
        {addNewColor && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              {translate("createStore.Color Hex Code")}
            </label>
            <input
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              placeholder={translate("createStore.Example #1d4ed8")}
              type="text"
              maxLength={7}
              value={selectedColor}
              onChange={handleHexChange}
            />
            {errors?.color && (
              <span className="text-red-500 text-sm">
                {translate(`createStore.${errors.color[0]}`)}
              </span>
            )}
          </div>
        )}
        {/* End: Custom Color Input */}

        {/* Start: Live Preview */}
        <div className="p-6 rounded-lg bg-slate-50 border border-gray-200">
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
        {/* End: Live Preview */}
      </div>
      {/* End: Main Content */}
    </div>
  );
}
