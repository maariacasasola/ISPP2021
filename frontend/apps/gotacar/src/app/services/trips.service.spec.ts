import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { fakeAsync, getTestBed, inject, TestBed, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { environment } from "../../environments/environment";
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

const USER_OBJECT = {
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

const TRIP_OBJECT = {
    cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
    comments: '',
    end_date: new Date(2021, 6, 4, 13, 30, 24),
    startDate: new Date(2021, 6, 4, 13, 30, 24),
    endingPoint: location2,
    startingPoint: location1,
    places: 3,
    price: 200,
    canceled: false,
    driver: USER_OBJECT,
};

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
});


