type LoadingSpinProps = {
  size?: number;
  color?: string;
};

/**
 *
 * @param size - The size of the loading spinner in pixels. Default is 24px.
 * @param color - The color of the loading spinner. Default is the current text color.
 */
export default function LoadingSpin({ size, color }: LoadingSpinProps) {
  return (
    <span
      className="material-symbols-outlined text-[18px] animate-spin text-primary"
      style={{
        fontSize: size ? `${size}px` : "24px",
        color: color,
      }}
    >
      progress_activity
    </span>
  );
}
