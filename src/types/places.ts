export type PlaceCategory = 'frozen-lakes' | 'snow-villages' | 'winter-wonders';

export type Place = {
  id: string;
  name: string;
  coordinates: string;
  lat: number;
  lng: number;
  description: string;
  category: PlaceCategory;
  image: number;
};
