import { Trip } from "./trip";
import { User } from "./user";

export interface TripOrder {
    trip: Trip;
    user: User;
    date: Date;
    price: Number;
    paymentIntent: string;
    places: Number;
    status: string;
}