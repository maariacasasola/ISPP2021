import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { Trip } from "../shared/services/trip";
import { TripOrder } from "../shared/services/trip-order";
import { User } from "../shared/services/user";
import { TripsService } from "./trips.service";

const location1 = {
    name: 'Sevilla',
    address: 'Calle Canal 48"',
    lat: 37.3747084,
    lng: -5.9649715,
};

const location2 = {
    name: 'Sevilla',
    address: 'Av. Diego Martínez Barrio',
    lat: 37.37625144174958,
    lng: -5.976345387146261,
};

const USER_OBJECT: User = {
    id: '1',
    firstName: 'Manuel',
    lastName: 'Fernandez',
    uid: '1',
    email: 'manan@gmail.com',
    dni: '312312312',
    profilePhoto: 'http://dasdasdas.com',
    birthdate: new Date(1994, 6, 4, 13, 30, 24),
    roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
    emailVerified: true,
    timesBanned: 2,
    token: '12312ed2',
};

const TRIP_OBJECT: Trip = {
    cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
    comments: 'Viaje de Reina a Nervión',
    end_date: new Date(2021, 6, 4, 13, 30, 24),
    start_date: new Date(2021, 6, 4, 13, 30, 24),
    ending_point: location2,
    starting_point: location1,
    places: 3,
    price: 200,
};

const TRIP_ORDER_OBJECT: TripOrder = {
    trip: TRIP_OBJECT,
    user: USER_OBJECT,
    date: new Date(2021, 6, 4, 13, 30, 24),
    price: 300,
    paymentIntent: null,
    places: 2,
    status: "PROCCESSING",
}

describe('TripsService', () => {
    let service;
    let injector: TestBed;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        injector = getTestBed();
        service = TestBed.inject(TripsService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get all trips', async () => {
        service.get_all_trips();
        const req = httpMock.expectOne(`${environment.api_url}/list_trips`);
        expect(req.request.method).toBe('GET');
    });

    it('should get trip', async () => {
        service.get_trip('15');
        const req = httpMock.expectOne(`${environment.api_url}/trip/15`);
        expect(req.request.method).toBe('GET');
    });

    it('should get all trip orders', async () => {
        service.get_all_trip_orders();
        const req = httpMock.expectOne(`${environment.api_url}/trip_order/list`);
        expect(req.request.method).toBe('GET');
    });

    it('should get trip order', async () => {
        service.get_trip_order('10');
        const req = httpMock.expectOne(`${environment.api_url}/trip_order/show/10`);
        expect(req.request.method).toBe('GET');
    });

    it('should get trip orders from an user', async () => {
        service.get_trips();
        const req = httpMock.expectOne(`${environment.api_url}/list_trip_orders`);
        expect(req.request.method).toBe('GET');
    });

    it('should create trip', async () => {
        service.create_trip(TRIP_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/create_trip`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.comments).toBe(TRIP_OBJECT.comments);
    });

    it('should cancel trip order', async () => {
        service.cancel_driver_trip('15');
        const req = httpMock.expectOne(`${environment.api_url}/cancel_trip_driver/15`);
        expect(req.request.method).toBe('POST');
    });

    it('should cancel driver trip', async () => {
        service.cancel_trip_order('20');
        const req = httpMock.expectOne(`${environment.api_url}/trip-order/20/cancel`);
        expect(req.request.method).toBe('POST');
    });

    it('should request cancel trip order', async () => {
        service.cancel_trip('20');
        const req = httpMock.expectOne(`${environment.api_url}/cancel_trip_order_request/20`);
        expect(req.request.method).toBe('POST');
    });

    it('should search trip', async () => {
        const search_params = {
            starting_point: location1,
            ending_point: location2,
            places: 1,
            date: new Date()
        }
        service.seach_trips(search_params.starting_point, search_params.ending_point,search_params.places, search_params.date);
        const req = httpMock.expectOne(`${environment.api_url}/search_trips`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.starting_point).toBe(search_params.starting_point);
    });

    it('should get users by trip', async () => {
        service.get_users_by_trip('15');
        const req = httpMock.expectOne(`${environment.api_url}/list_users_trip/15`);
        expect(req.request.method).toBe('GET');
    });

    it('should get driver trips', async () => {
        service.get_driver_trips();
        const req = httpMock.expectOne(`${environment.api_url}/list_trips_driver`);
        expect(req.request.method).toBe('GET');
    });

    it('should create stripe session', async () => {
        service.create_stripe_session('15', '2', 'description');
        const req = httpMock.expectOne(`${environment.api_url}/create_session`);
        expect(req.request.method).toBe('POST');
    });

    it('should check if trip is complained', async () => {
        service.is_complained('15');
        const req = httpMock.expectOne(`${environment.api_url}/complaints/check/15`);
        expect(req.request.method).toBe('GET');
    });
});


