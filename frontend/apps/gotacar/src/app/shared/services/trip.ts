import { Location } from './location-model';

export interface Trip {
  starting_point: Location;
  ending_point: Location;
  price: number;
  start_date: Date;
  end_date: Date;
  comments: string;
  places: number;
}

export interface Point {
  lat: number;
  lng: number;
}
