import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs';

import { Place } from '../../../../core/models/place.model';
import { SearchParams } from '../../../../core/models/search-params.model';
import { PlacesApiService } from '../../../../core/services/places-api.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { PlaceDetailsPageComponent } from '../../../place-details/pages/place-details-page/place-details-page.component';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SearchFormComponent } from '../../components/search-form/search-form.component';

@Component({
  selector: 'app-search-page',
  imports: [
    SearchFormComponent,
    PlaceCardComponent,
    PlaceDetailsPageComponent,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  private readonly placesApiService = inject(PlacesApiService);
  private readonly wishlistService = inject(WishlistService);

  readonly places = signal<Place[]>([]);
  readonly selectedPlace = signal<Place | null>(null);

  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSearch(params: SearchParams): void {
    this.loading.set(true);
    this.searched.set(true);
    this.errorMessage.set(null);

    this.placesApiService
      .searchPlaces(params)
      .pipe(
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
        error: (error: unknown) => {
          console.error('Foursquare search error:', error);

          this.places.set([]);
          this.errorMessage.set(
            'Не вдалося завантажити місця. Перевірте API-ключ і параметри пошуку.',
          );
        },
      });
  }

  openPlaceDetails(place: Place): void {
    this.selectedPlace.set(place);
    document.body.style.overflow = 'hidden';
  }

  closePlaceDetails(): void {
    this.selectedPlace.set(null);
    document.body.style.overflow = '';
  }

  onWishlistToggle(place: Place): void {
    this.wishlistService.toggle(place);
  }

  isInWishlist(placeId: string): boolean {
    return this.wishlistService.isInWishlist(placeId);
  }
}