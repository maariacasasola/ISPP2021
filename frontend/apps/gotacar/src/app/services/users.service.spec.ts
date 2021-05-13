import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { UsersService } from "./users.service";

const USER_DATA_OBJECT = {
    id: '1',
    iban: 'ES1838958289184',
    experience: 2,
    car_data: '1234DDD',
    driving_license: 'https://dadadada.com',
};

const RATE_DATA_OBJECT = {
    to: '1',
    content: 'Buen conductor',
    points: 4,
    trip_id: '3',
}

describe('UsersService', () => {
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
        service = TestBed.inject(UsersService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get all users', async () => {
        service.get_all_users();
        const req = httpMock.expectOne(`${environment.api_url}/enrolled-user/list`);
        expect(req.request.method).toBe('GET');
    });

    it('should delete penalized account', async () => {
        service.delete_penalized_account('15');
        const req = httpMock.expectOne(`${environment.api_url}/delete-penalized-account/15`);
        expect(req.request.method).toBe('POST');
    });

    it('should delete account', async () => {
        service.delete_account();
        const req = httpMock.expectOne(`${environment.api_url}/delete-account`);
        expect(req.request.method).toBe('POST');
    });

    it('should update profile photo', async () => {
        service.update_profile_photo('https://dadadada.com');
        const req = httpMock.expectOne(`${environment.api_url}/user/update/profile-photo`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.profilePhoto).toBe('https://dadadada.com');
    });

    it('should convert user to driver', async () => {
        service.convert_to_driver('difnowou48');
        const req = httpMock.expectOne(`${environment.api_url}/driver/update`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.uid).toBe('difnowou48');
    });

    it('should get all driver requests', async () => {
        service.get_all_driver_requests();
        const req = httpMock.expectOne(`${environment.api_url}/driver-request/list`);
        expect(req.request.method).toBe('GET');
    });

    it('should request conversion to driver', async () => {
        service.request_conversion_to_driver(USER_DATA_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/driver/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.car_data).toBe(USER_DATA_OBJECT.car_data);
    });

    it('should rate user', async () => {
        service.rate_user(RATE_DATA_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/rate`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.points).toBe(RATE_DATA_OBJECT.points);
    });

    it('should check rate user', async () => {
        service.check_users_rated(RATE_DATA_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/rate/check`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.points).toBe(RATE_DATA_OBJECT.points);
    });

    it('should get user ratings', async () => {
        service.get_ratings_by_userid('1');
        const req = httpMock.expectOne(`${environment.api_url}/ratings/1`);
        expect(req.request.method).toBe('GET');
    });
});