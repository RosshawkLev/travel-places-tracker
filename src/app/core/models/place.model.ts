export interface Place {
  id: string;
  name: string;
  city: string;
  country: string;
  category: string;

  address?: string;
  latitude?: number;
  longitude?: number;

  rating?: number;
  popularity?: number;
  distance?: number;
  price?: number;

  description?: string;

  photoUrl?: string;
  photos?: string[];
  tips?: string[];

  phone?: string;
  email?: string;
  website?: string;

  openNow?: boolean;
  workingHours?: string;

  hasParking?: boolean;
  hasWifi?: boolean;
  outdoorSeating?: boolean;
}