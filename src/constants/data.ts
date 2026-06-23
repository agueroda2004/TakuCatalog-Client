export const TAKU_SLUG = "taku-catalog/";

export const LANGUAGES = [
  { code: "es", label: "Spanish" },
  { code: "en", label: "English" },
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
];

export const COUNTRY_CODES = [
  {
    code: "+506",
    country: "Costa Rica",
    placeholder: "1234-5678",
    pattern: /(\d{4})(\d{4})/,
    template: "$1-$2",
    maxDigits: 8,
  },
  {
    code: "+1",
    country: "USA",
    placeholder: "(123) 456-7890",
    pattern: /(\d{3})(\d{3})(\d{4})/,
    template: "($1) $2-$3",
    maxDigits: 10,
  },
  {
    code: "+52",
    country: "Mexico",
    placeholder: "123 456 7890",
    pattern: /(\d{2})(\d{4})(\d{4})/,
    template: "$1 $2 $3",
    maxDigits: 10,
  },
];

export const COUNTRY_CODE_MAP: Record<
  string,
  {
    country: string;
    placeholder: string;
    pattern: RegExp;
    template: string;
    maxDigits: number;
  }
> = {
  "+506": {
    country: "Costa Rica",
    placeholder: "1234-5678",
    pattern: /(\d{4})(\d{4})/,
    template: "$1-$2",
    maxDigits: 8,
  },
  "+1": {
    country: "USA",
    placeholder: "(123) 456-7890",
    pattern: /(\d{3})(\d{3})(\d{4})/,
    template: "($1) $2-$3",
    maxDigits: 10,
  },
  "+52": {
    country: "Mexico",
    placeholder: "123 456 7890",
    pattern: /(\d{2})(\d{4})(\d{4})/,
    template: "$1 $2 $3",
    maxDigits: 10,
  },
};

export const COLORS = [
  "#1d4ed8", // Blue (primary)
  "#dc2626", // Red
  "#16a34a", // Green
  "#ca8a04", // Yellow
  "#9333ea", // Purple
  "#db2777", // Pink
  "#0d9488", // Teal
  "#ea580c", // Orange
  "#0891b2", // Cyan
  "#4f46e5", // Indigo
  "#be123c", // Rose
  "#15803d", // Emerald
  "#a16207", // Amber
  "#7c3aed", // Violet
  "#9d174d", // Dark Pink
  "#0f766e", // Dark Teal
];
