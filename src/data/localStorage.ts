import type { IStorage } from "@/data";

/**
 * Singleton implementation of {@link IStorage} backed by the browser's
 * `window.localStorage`.
 *
 * Usage:
 * ```ts
 * import { LocalStorage } from "@/data/localStorage";
 *
 * const storage = LocalStorage.getInstance();
 * storage.set("my-key", { foo: "bar" });
 * const value = storage.get<{ foo: string }>("my-key");
 * ```
 */
export class LocalStorage implements IStorage {
  private static instance: LocalStorage | null = null;

  /** Use `LocalStorage.getInstance()` instead. */
  private constructor() {}

  /** Returns the singleton instance, creating it on first access. */
  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  /** Whether `window.localStorage` is available (guards against SSR). */
  private get isAvailable(): boolean {
    return typeof window !== "undefined";
  }

  get<T>(key: string): T | null {
    if (!this.isAvailable) return null;

    const raw = localStorage.getItem(key);
    if (raw === null) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isAvailable) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isAvailable) return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isAvailable) return;
    localStorage.clear();
  }

  getString(key: string): string {
    if (!this.isAvailable) return "";
    return localStorage.getItem(key) || "";
  }

  setString(key: string, value: string): void {
    if (!this.isAvailable) return;
    localStorage.setItem(key, value);
  }
}
