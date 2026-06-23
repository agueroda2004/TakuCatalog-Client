import { useTranslation } from "react-i18next";

type MoveButtonsProps = {
  step: number;
  onNext: () => void;
  onBack: () => void;
};
export default function MoveButtons({
  step,
  onNext,
  onBack,
}: MoveButtonsProps) {
  const { t: translate } = useTranslation();
  return (
    <div className="flex flex-row gap-2 w-full">
      <button
        className="cursor-pointer px-6 rounded-lg py-2 bg-white text-gray-500 border border-gray-200 shadow-sm w-full disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
        onClick={onBack}
        disabled={step === 1}
      >
        {translate("createStore.Back")}
      </button>
      <button
        className="px-6 rounded-lg py-2 bg-primary text-white shadow-sm w-full disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-white/50 cursor-pointer"
        onClick={onNext}
      >
        {step === 3
          ? translate("createStore.Finish")
          : translate("createStore.Next")}
      </button>
    </div>
  );
}
