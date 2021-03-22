import { Location } from "./location-model"

export interface Trip {

    starting_point: Location;
    endingPoint: Location;
    price: number;
    startDate: Date;
    endingDate: Date;
    cancelationDate: Date;
    comment: string;
    places: number;
    canceled: boolean;

}
