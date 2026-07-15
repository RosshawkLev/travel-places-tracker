import { Injectable, signal } from '@angular/core';

import { Place } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly storageKey = 'travel-places-wishlist';

  private readonly wishlistSignal = signal<Place[]>(
    this.loadFromStorage(),
  );

  readonly wishlist = this.wishlistSignal.asReadonly();

  add(place: Place): void {
    const currentWishlist = this.wishlistSignal();

    const alreadyExists = currentWishlist.some(
      (wishlistPlace) => wishlistPlace.id === place.id,
    );

    if (alreadyExists) {
      return;
    }

    const updatedWishlist = [...currentWishlist, place];

    this.updateWishlist(updatedWishlist);
  }

  remove(placeId: string): void {
    const updatedWishlist = this.wishlistSignal().filter(
      (place) => place.id !== placeId,
    );

    this.updateWishlist(updatedWishlist);
  }

  toggle(place: Place): void {
    if (this.isInWishlist(place.id)) {
      this.remove(place.id);
      return;
    }

    this.add(place);
  }

  isInWishlist(placeId: string): boolean {
    return this.wishlistSignal().some(
      (place) => place.id === placeId,
    );
  }

  clear(): void {
    this.updateWishlist([]);
  }

  private updateWishlist(wishlist: Place[]): void {
    this.wishlistSignal.set(wishlist);
    this.saveToStorage(wishlist);
  }

  private saveToStorage(wishlist: Place[]): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(wishlist),
      );
    } catch (error) {
      console.error(
        'Не вдалося зберегти wishlist у localStorage.',
        error,
      );
    }
  }

  private loadFromStorage(): Place[] {
    try {
      const storedWishlist = localStorage.getItem(this.storageKey);

      if (!storedWishlist) {
        return [];
      }

      const parsedWishlist: unknown = JSON.parse(storedWishlist);

      return Array.isArray(parsedWishlist)
        ? parsedWishlist as Place[]
        : [];
    } catch (error) {
      console.error(
        'Не вдалося прочитати wishlist із localStorage.',
        error,
      );

      return [];
    }
  }
}