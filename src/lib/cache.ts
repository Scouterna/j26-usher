type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export function createCache<T>(ttl: number) {
  const cache = new Map<string, CacheEntry<T>>();

  function set(key: string, value: T) {
    const expiresAt = Date.now() + ttl;
    cache.set(key, { value, expiresAt });
  }

  function get(key: string): T | null {
    const entry = cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      cache.delete(key);
      return null;
    }
    return entry.value;
  }

  function clear() {
    cache.clear();
  }

  return { set, get, clear };
}
