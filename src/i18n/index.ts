export type Lang = "id" | "en";

export const t = {
  brand: {
    foundation: { id: "Yayasan Pusaka", en: "Pusaka Foundation" },
  },
  nav: {
    open: { id: "Buka Undangan", en: "Open Invitation" },
    schedule: { id: "Susunan Acara", en: "Schedule" },
    venue: { id: "Lokasi", en: "Venue" },
    history: { id: "Sejarah", en: "History" },
    gallery: { id: "Galeri", en: "Gallery" },
    donate: { id: "Donasi", en: "Donations" },
    contact: { id: "Kontak", en: "Contact" },
  },
  labels: {
    invitation: { id: "Undangan", en: "Invitation" },
    countdown: { id: "Menuju Acara", en: "Until the Event" },
    days: { id: "Hari", en: "Days" },
    hours: { id: "Jam", en: "Hours" },
    minutes: { id: "Menit", en: "Minutes" },
    seconds: { id: "Detik", en: "Seconds" },
    openMaps: { id: "Buka di Google Maps", en: "Open in Google Maps" },
    openWa: { id: "Hubungi via WhatsApp", en: "Contact via WhatsApp" },
    addToCalendar: { id: "Tambah ke Kalender", en: "Add to Calendar" },
    copy: { id: "Salin", en: "Copy" },
    copied: { id: "Tersalin", en: "Copied" },
    bankAccount: { id: "Nomor Rekening", en: "Account Number" },
    accountName: { id: "Atas Nama", en: "Account Name" },
    pengurus: { id: "Pengurus", en: "Committee" },
    sectionAbout: { id: "Tentang Acara", en: "About the Event" },
    sectionSchedule: { id: "Susunan Acara", en: "Order of Events" },
    sectionVenue: { id: "Lokasi", en: "Venue" },
    sectionHistory: { id: "Catatan Sejarah", en: "A Historical Note" },
    sectionGallery: { id: "Galeri", en: "Gallery" },
    sectionDonate: { id: "Donasi & Dukungan", en: "Donations & Support" },
    sectionContact: { id: "Kontak", en: "Contact" },
    notes: { id: "Catatan", en: "Notes" },
    share: { id: "Bagikan", en: "Share" },
    backToTop: { id: "Kembali ke atas", en: "Back to top" },
  },
  cover: {
    eyebrow: { id: "The Honorable Are Cordially Invited", en: "The Honorable Are Cordially Invited" },
    button: { id: "Buka Undangan", en: "Open Invitation" },
    note: {
      id: "Mohon maaf bila ada kesalahan dalam penulisan nama/alamat.",
      en: "We apologize for any misspelling of names or addresses.",
    },
  },
} as const;

export function pick<T extends { id: string; en: string }>(b: T, lang: Lang): string {
  return b[lang];
}
