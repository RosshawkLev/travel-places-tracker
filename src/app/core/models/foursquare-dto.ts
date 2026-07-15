export interface FoursquareSearchResponseDto {
  results: FoursquarePlaceDto[];
  context?: FoursquareContextDto;
}

export interface FoursquarePlaceDto {
  fsq_place_id: string;
  name: string;
  latitude: number;
  longitude: number;

  categories?: FoursquareCategoryDto[];
  location?: FoursquareLocationDto;

  description?: string;
  distance?: number;
  popularity?: number;
  rating?: number;
  price?: number;

  photos?: FoursquarePhotoDto[];
  tips?: FoursquareTipDto[];

  tel?: string;
  email?: string;
  website?: string;
  link?: string;

  attributes?: FoursquareAttributesDto;
  hours?: FoursquareHoursDto;
}

export interface FoursquareCategoryDto {
  fsq_category_id: string;
  name: string;
  short_name?: string;
  plural_name?: string;
}

export interface FoursquareLocationDto {
  address?: string;
  locality?: string;
  region?: string;
  postcode?: string;
  admin_region?: string;
  post_town?: string;
  country?: string;
  formatted_address?: string;
}

export interface FoursquarePhotoDto {
  fsq_photo_id?: string;
  id?: string;
  prefix: string;
  suffix: string;
  width?: number;
  height?: number;
}

export interface FoursquareTipDto {
  fsq_tip_id?: string;
  id?: string;
  text: string;
  url?: string;
  lang?: string;
  agree_count?: number;
  disagree_count?: number;
}

export interface FoursquareAttributesDto {
  restroom?: boolean;
  outdoor_seating?: boolean;
  atm?: boolean;
  has_parking?: boolean;
  wifi?: string;
  delivery?: boolean;
  reservations?: boolean;
  takes_credit_card?: boolean;
}

export interface FoursquareHoursDto {
  display?: string;
  is_local_holiday?: boolean;
  open_now?: boolean;
}

export interface FoursquareContextDto {
  geo_bounds?: {
    circle?: {
      center?: {
        latitude: number;
        longitude: number;
      };
      radius?: number;
    };
  };
}