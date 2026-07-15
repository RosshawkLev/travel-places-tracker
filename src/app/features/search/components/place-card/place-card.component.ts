import { Component, input, output } from '@angular/core';

import { Place } from '../../../../core/models/place.model';

@Component({
  selector: 'app-place-card',
  imports: [],
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss',
})
export class PlaceCardComponent {
  readonly place = input.required<Place>();
  readonly isInWishlist = input(false);

  readonly wishlistToggle = output<Place>();
  readonly placeSelected = output<Place>();

  openDetails(): void {
    this.placeSelected.emit(this.place());
  }

  onWishlistToggle(event: MouseEvent): void {
    event.stopPropagation();
    this.wishlistToggle.emit(this.place());
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDetails();
    }
  }
}