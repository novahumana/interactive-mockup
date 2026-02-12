"use client";

import { useEffect } from "react";
import { LocalStorage } from "@/data/localStorage";
import { STORAGE_KEYS } from "@/data/constants";
import { patientsData } from "@/mocks/patient-data";

/**
 * Client component that seeds `localStorage` with the mock patient data
 * **on every mount** (i.e. on every full page reload).
 *
 * Because this is a demo application, user modifications are intentionally
 * ephemeral: they survive client-side navigation (the data lives in
 * `"humana-patients"` in storage) but are reset to mock defaults whenever
 * the browser reloads.
 *
 * It renders its children transparently — no extra DOM wrapper is produced.
 *
 * Place it high in the component tree (e.g. inside `layout.tsx`) so the seed
 * runs before any page component reads from storage.
 */
export function StorageBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storage = LocalStorage.getInstance();
    storage.set(STORAGE_KEYS.patients, patientsData);
  }, []);

  return <>{children}</>;
}
