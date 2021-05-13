import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { GeocoderServiceService } from "./geocoder-service.service";

describe('GeocoderServiceService', () => {
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
        service = TestBed.inject(GeocoderServiceService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get location from address', async () => {
        service.get_location_from_address('Calle Sierpes');
        const req = httpMock.expectOne(`https://maps.googleapis.com/maps/api/geocode/json?address=Calle Sierpes&region=es&key=${environment.geocoding_api_key}`);
        expect(req.request.method).toBe('GET');
    });

});
