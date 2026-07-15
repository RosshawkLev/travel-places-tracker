export interface SearchParams {
  keyword: string;
  city: string;

  latitude?: number;
  longitude?: number;

  radius?: number;
  limit?: number;
}