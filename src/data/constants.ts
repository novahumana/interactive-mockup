/**
 * storage key constants
 *
 * Centralizes every key used by the app so they can be referenced
 * safely from consumers without risk of typos.
 */
export const STORAGE_KEYS = {
  /** Unified patient data store – seeded from mock data at bootstrap. */
  patients: "humana-patients",

  /* ── preference keys (simple string values, not part of the Patient model) ── */
  bookmarkPreferredFramework: "humana-bookmark-preferred-framework",
  bookmarkPreferredCategory: "humana-bookmark-preferred-category",
} as const;
