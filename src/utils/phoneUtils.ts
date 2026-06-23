import { COUNTRY_CODE_MAP } from "../constants/data";

export function getPhonePlaceholder(countryCode: string): string {
  return COUNTRY_CODE_MAP[countryCode]?.placeholder || "1234567890";
}

// ==== changes here: Phone number formatter
export function formatPhoneNumber(phone: string, countryCode: string): string {
  const format = COUNTRY_CODE_MAP[countryCode];
  if (!format) return phone;

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Limit to max digits
  const limitedDigits = digits.slice(0, format.maxDigits);

  // Apply format pattern
  return limitedDigits.replace(format.pattern, format.template);
}

export function getMaxDigits(countryCode: string): number {
  return COUNTRY_CODE_MAP[countryCode]?.maxDigits || 15;
}
// ==== changes here: End phone formatter

