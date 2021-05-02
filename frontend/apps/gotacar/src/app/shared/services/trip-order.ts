import { Trip } from "./trip";
import { User } from "./user";

export interface TripOrder {
    trip: Trip;
    user: User;
    date: Date;
    price: number;
    paymentIntent: string;
    places: number;
    status: string;
}