/**
 * Generic storage interface for persisting application data.
 *
 * Abstracts the underlying storage mechanism (browser localStorage, cloud object store,
 * in-memory cache, etc.) so that consumers depend on a contract rather than a concrete
 * implementation.
 *
 * All methods that deal with structured data accept a generic type parameter `T` so the
 * caller can work with strongly-typed values instead of raw strings.
 */
export interface IStorage {
  /**
   * Retrieve a JSON-serialized value by key.
   * Returns `null` when the key does not exist or the stored value cannot be parsed.
   */
  get<T>(key: string): T | null;

  /**
   * Persist a value under the given key. The value is JSON-serialized before storage.
   */
  set<T>(key: string, value: T): void;

  /**
   * Remove a single entry by key.
   */
  remove(key: string): void;

  /**
   * Remove **all** entries managed by this storage instance.
   */
  clear(): void;

  /**
   * Retrieve a raw string value by key (useful for simple preferences).
   * Returns an empty string when the key does not exist.
   */
  getString(key: string): string;

  /**
   * Persist a raw string value under the given key.
   */
  setString(key: string, value: string): void;
}
