import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../../environments';
import {
  FoursquarePhotoDto,
  FoursquarePlaceDto,
  FoursquareSearchResponseDto,
} from '../models/foursquare-dto';
import { Place } from '../models/place.model';
import { SearchParams } from '../models/search-params.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesApiService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);

  private readonly searchUrl =
    `${environment.foursquareApiUrl}/places/search`;

  private readonly cacheTtlMs = 10 * 60 * 1000;

  searchPlaces(search: SearchParams): Observable<Place[]> {
    const cacheKey = this.createCacheKey(search);

    const cachedPlaces = this.cacheService.get<Place[]>(cacheKey);

    if (cachedPlaces) {
      console.log('Places loaded from cache:', cacheKey);

      return of(cachedPlaces);
    }

    const params = this.createHttpParams(search);
    const headers = this.createHeaders();

    return this.http
      .get<FoursquareSearchResponseDto>(this.searchUrl, {
        headers,
        params,
      })
      .pipe(
        map((response) =>
          response.results.map((place) => this.mapPlace(place)),
        ),
        tap((places) => {
          this.cacheService.set(
            cacheKey,
            places,
            this.cacheTtlMs,
          );
        }),
      );
  }

  private createCacheKey(search: SearchParams): string {
    const keyword = search.keyword
      .trim()
      .toLowerCase();

    const city = search.city
      .trim()
      .toLowerCase();

    const location =
      search.latitude !== undefined &&
      search.longitude !== undefined
        ? `${search.latitude.toFixed(4)},${search.longitude.toFixed(4)}`    //Round up location, to not generate new key when GPS signal will slightly change
        : city || 'ip-bias';

    const radius = search.radius ?? 'default';
    const limit = search.limit ?? 'default';

    return [
      'places',
      keyword || 'all',
      location,
      radius,
      limit,
    ].join(':');
  }

  private createPlaceDetailsCacheKey(placeId: string): string {
    return `place-details:${placeId}`;
  }

  private createHttpParams(search: SearchParams): HttpParams {
    let params = new HttpParams();

    const keyword = search.keyword.trim();
    const city = search.city.trim();

    if (keyword) {
      params = params.set('query', keyword);
    }

    const hasCoordinates =
      search.latitude !== undefined &&
      search.longitude !== undefined;

    if (hasCoordinates) {
      params = params.set(
        'll',
        `${search.latitude},${search.longitude}`,
      );
    } else if (city) {
      params = params.set('near', city);
    }

    if (search.radius !== undefined) {
      params = params.set(
        'radius',
        search.radius.toString(),
      );
    }

    if (search.limit !== undefined) {
      params = params.set(
        'limit',
        search.limit.toString(),
      );
    }

    return params;
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.foursquareApiKey}`,
      'X-Places-Api-Version': '2025-06-17',
      Accept: 'application/json',
    });
  }

  private mapPlace(dto: FoursquarePlaceDto): Place {
    const photoUrls =
      dto.photos?.map((photo) =>
        this.createPhotoUrl(photo),
      ) ?? [];

    return {
      id: dto.fsq_place_id,
      name: dto.name,

      city:
        dto.location?.locality ??
        dto.location?.post_town ??
        dto.location?.region ??
        '',

      country: dto.location?.country ?? '',

      category:
        dto.categories
          ?.map((category) => category.name)
          .join(', ') || 'Без категорії',

      address:
        dto.location?.formatted_address ??
        dto.location?.address ??
        '',

      latitude: dto.latitude,
      longitude: dto.longitude,

      rating: dto.rating,
      popularity: dto.popularity,
      distance: dto.distance,
      price: dto.price,

      description: dto.description,

      photoUrl: photoUrls[0],
      photos: photoUrls,

      tips:
        dto.tips
          ?.map((tip) => tip.text)
          .filter((tip): tip is string => Boolean(tip)) ?? [],

      phone: dto.tel,
      email: dto.email,
      website: dto.website,

      openNow: dto.hours?.open_now,
      workingHours: dto.hours?.display,

      hasParking: dto.attributes?.has_parking,
      hasWifi: Boolean(dto.attributes?.wifi),
      outdoorSeating: dto.attributes?.outdoor_seating,
    };
  }

  private createPhotoUrl(
    photo: FoursquarePhotoDto,
  ): string {
    return `${photo.prefix}600x400${photo.suffix}`;
  }

  getPlaceDetails(placeId: string): Observable<Place> {
    const cacheKey = this.createPlaceDetailsCacheKey(placeId);

    const cachedPlace = this.cacheService.get<Place>(cacheKey);

    if (cachedPlace) {
      console.log('Place details loaded from cache:', cacheKey);

      return of(cachedPlace);
    }

    const url = `${environment.foursquareApiUrl}/places/${placeId}`;
    const headers = this.createHeaders();

    return this.http
      .get<FoursquarePlaceDto>(url, {
        headers,
      })
      .pipe(
        map((response) => this.mapPlace(response)),
        tap((place) => {
          this.cacheService.set(
            cacheKey,
            place,
            this.cacheTtlMs,
          );
        }),
      );
  }
}