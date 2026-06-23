import { useTranslation } from "react-i18next";

type ProgressProps = {
  currentStep: number;
};

type ReturnClass = {
  Number: string;
  Line: string;
};

export default function Progress({ currentStep }: ProgressProps) {
  const { t: translate } = useTranslation();
  const handleCurrentStep = (step: number): ReturnClass => {
    if (step === currentStep) {
      return {
        Number: "bg-primary text-white size-12",
        Line: "border-gray-300",
      };
    } else if (step < currentStep) {
      return {
        Number: "bg-primary/80 text-white size-10",
        Line: "border-primary/80",
      };
    } else {
      return {
        Number: "bg-gray-300 text-white size-9",
        Line: "border-gray-300",
      };
    }
  };
  return (
    <div className="flex flex-row gap-1 items-center">
      <div
        className={`bg-primary rounded-xl text-white text-center flex justify-center items-center text-xl ${handleCurrentStep(1).Number}`}
      >
        1
      </div>
      <div className={`w-10 border-t-2 ${handleCurrentStep(1).Line}`} />
      <div
        className={`bg-gray-300 rounded-xl text-white text-center flex justify-center items-center text-xl ${handleCurrentStep(2).Number}`}
      >
        2
      </div>
      <div className={`w-10 border-t-2 ${handleCurrentStep(2).Line}`} />
      <div
        className={`bg-gray-300 rounded-xl text-white text-center flex justify-center items-center text-xl ${handleCurrentStep(3).Number}`}
      >
        3
      </div>
    </div>
  );
}
