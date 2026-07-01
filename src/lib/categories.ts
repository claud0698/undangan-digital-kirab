/**
 * Selectable guest categories for the admin tool.
 * Edit this list to change the dropdown options everywhere.
 */
export const CATEGORIES = [
  "Umat",
  "Dewan Kehormatan",
  "Panitia",
  "Sponsor",
  "Donatur",
  "Tamu VIP",
  "Keluarga",
  "Umum",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isValidCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

/**
 * Salutation presets for the "Sebutan" field. Shown as a datalist —
 * the admin can pick one or type a custom value.
 */
export const SALUTATIONS = [
  "Bapak",
  "Ibu",
  "Bapak & Ibu",
  "Bapak/Ibu",
  "Prof.",
  "Dr.",
  "Prof. Dr.",
  "Suhu",
  "Y.M.",
  "Romo",
  "Keluarga",
] as const;
