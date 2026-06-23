import LoadingSpin from "../LoadingSpin";

type ButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  isLoadingText?: string;
};

export default function Button({
  text,
  onClick,
  disabled,
  className,
  isLoading,
  isLoadingText,
}: ButtonProps) {
  return (
    <button
      className={`p-2  text-white rounded-lg cursor-pointer hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 ${className || "bg-primary"}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {isLoading ? (
        <>
          {isLoadingText || text}
          <LoadingSpin color="#FFFFFF" />
        </>
      ) : (
        text
      )}
    </button>
  );
}
