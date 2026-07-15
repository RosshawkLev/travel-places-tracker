import {
  Component,
  inject,
  signal,
} from '@angular/core';

import { Place } from '../../../../core/models/place.model';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { PlaceDetailsPageComponent } from '../../../place-details/pages/place-details-page/place-details-page.component';
import { PlaceCardComponent } from '../../../search/components/place-card/place-card.component';

@Component({
  selector: 'app-wishlist-page',
  imports: [
    PlaceCardComponent,
    PlaceDetailsPageComponent,
  ],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.scss',
})
export class WishlistPageComponent {
  private readonly wishlistService = inject(WishlistService);

  readonly wishlist = this.wishlistService.wishlist;
  readonly selectedPlace = signal<Place | null>(null);

  onWishlistToggle(place: Place): void {
    this.wishlistService.toggle(place);
  }

  clearWishlist(): void {
    this.wishlistService.clear();
  }

  openPlaceDetails(place: Place): void {
    this.selectedPlace.set(place);
    document.body.style.overflow = 'hidden';
  }

  closePlaceDetails(): void {
    this.selectedPlace.set(null);
    document.body.style.overflow = '';
  }
}