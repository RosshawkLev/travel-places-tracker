import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly prefix = 'places-cache:';

  get<T>(key: string): T | null {
    const storageKey = this.prefix + key;
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    try {
      const entry = JSON.parse(
        storedValue,
      ) as CacheEntry<T>;

      if (Date.now() >= entry.expiresAt) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return entry.data;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttlMs,
    };

    localStorage.setItem(
      this.prefix + key,
      JSON.stringify(entry),
    );
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keysToRemove: string[] = [];

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) =>
      localStorage.removeItem(key),
    );
  }
}