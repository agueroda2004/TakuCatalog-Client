type InputTextProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  children?: React.ReactNode;
};

export default function InputText({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  children,
}: InputTextProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative flex items-center">
        {children && <div className="absolute left-3">{children}</div>}
        <input
          className={`py-2 border border-gray-200 outline-none focus:border-primary rounded-lg transition-colors disabled:bg-gray-50 w-full ${children ? "pl-10" : "px-2"}`}
          placeholder={placeholder}
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
