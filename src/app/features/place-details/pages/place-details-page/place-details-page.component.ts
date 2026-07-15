import {
  Component,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs';

import { Place } from '../../../../core/models/place.model';
import { PlacesApiService } from '../../../../core/services/places-api.service';

@Component({
  selector: 'app-place-details-page',
  imports: [],
  templateUrl: './place-details-page.component.html',
  styleUrl: './place-details-page.component.scss',
})
export class PlaceDetailsPageComponent implements OnInit {
  private readonly placesApiService = inject(PlacesApiService);

  readonly placeId = input.required<string>();
  readonly initialPlace = input<Place | null>(null);

  readonly closed = output<void>();

  readonly place = signal<Place | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Одразу показуємо базову інформацію з результату пошуку.
    this.place.set(this.initialPlace());

    // Після цього отримуємо повну інформацію.
    this.loadPlaceDetails();
  }

  close(): void {
    this.closed.emit();
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  retry(): void {
    this.loadPlaceDetails();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  private loadPlaceDetails(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.placesApiService
      .getPlaceDetails(this.placeId())
      .pipe(
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (place) => {
          this.place.set(place);
        },
        error: (error: unknown) => {
          console.error(
            'Failed to load place details:',
            error,
          );

          this.errorMessage.set(
            'Не вдалося завантажити детальну інформацію про місце.',
          );
        },
      });
  }
}