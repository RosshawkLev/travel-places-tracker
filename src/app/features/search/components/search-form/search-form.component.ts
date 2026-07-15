import { Component, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SearchParams } from '../../../../core/models/search-params.model';

@Component({
  selector: 'app-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  readonly search = output<SearchParams>();

  readonly locationLoading = signal(false);
  readonly locationError = signal<string | null>(null);

  private latitude: number | null = null;
  private longitude: number | null = null;

  readonly searchForm = new FormGroup({
    keyword: new FormControl('', {
      nonNullable: true,
    }),

    city: new FormControl('', {
      nonNullable: true,
    }),

    useGeolocation: new FormControl(false, {
      nonNullable: true,
    }),

    radius: new FormControl<number | null>(null, {
      validators: [
        Validators.min(1),
        Validators.max(100000),
      ],
    }),

    limit: new FormControl<number | null>(null, {
      validators: [
        Validators.min(1),
        Validators.max(50),
      ],
    }),
  });

  onGeolocationChange(): void {
    const useGeolocation =
      this.searchForm.controls.useGeolocation.value;

    this.locationError.set(null);

    if (!useGeolocation) {
      this.clearGeolocation();
      return;
    }

    this.requestGeolocation();
  }

  onSubmit(): void {
    this.searchForm.markAllAsTouched();

    if (this.searchForm.invalid) {
      return;
    }

    const formValue = this.searchForm.getRawValue();

    if (
      formValue.useGeolocation &&
      (this.latitude === null || this.longitude === null)
    ) {
      this.locationError.set(
        'Не вдалося отримати координати. Дозвольте доступ до геолокації.',
      );

      return;
    }

    const params: SearchParams = {
      keyword: formValue.keyword.trim(),
      city: formValue.useGeolocation
        ? ''
        : formValue.city.trim(),
    };

    if (
      formValue.useGeolocation &&
      this.latitude !== null &&
      this.longitude !== null
    ) {
      params.latitude = this.latitude;
      params.longitude = this.longitude;
    }

    if (formValue.radius !== null) {
      params.radius = formValue.radius;
    }

    if (formValue.limit !== null) {
      params.limit = formValue.limit;
    }

    this.search.emit(params);
  }

  onReset(): void {
    this.searchForm.reset({
      keyword: '',
      city: '',
      useGeolocation: false,
      radius: null,
      limit: null,
    });

    this.clearGeolocation();
  }

  private requestGeolocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set(
        'Ваш браузер не підтримує геолокацію.',
      );

      this.searchForm.controls.useGeolocation.setValue(false);

      return;
    }

    this.locationLoading.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.searchForm.controls.city.disable({
          emitEvent: false,
        });

        this.locationLoading.set(false);
      },
      (error) => {
        this.locationLoading.set(false);
        this.searchForm.controls.useGeolocation.setValue(false);

        this.locationError.set(
          this.getGeolocationErrorMessage(error),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }

  private clearGeolocation(): void {
    this.latitude = null;
    this.longitude = null;

    this.searchForm.controls.city.enable({
      emitEvent: false,
    });

    this.locationLoading.set(false);
    this.locationError.set(null);
  }

  private getGeolocationErrorMessage(
    error: GeolocationPositionError,
  ): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Доступ до геолокації заборонено користувачем.';

      case error.POSITION_UNAVAILABLE:
        return 'Не вдалося визначити ваше місцезнаходження.';

      case error.TIMEOUT:
        return 'Перевищено час очікування геолокації.';

      default:
        return 'Сталася помилка під час визначення геолокації.';
    }
  }
}