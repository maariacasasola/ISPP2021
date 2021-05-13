import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { MeetingPoint } from "../shared/services/meeting-point";
import { MeetingPointService } from "./meeting-point.service";

const MEETING_POINT_OBJECT: MeetingPoint={
    name: 'Calle Sierpes',
    lat: 37.3898193500141,
    lng: -5.99427284979182
}

describe('MeetingPointService', () => {
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
        service = TestBed.inject(MeetingPointService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get all meeting points', async () => {
        service.get_all_meeting_points();
        const req = httpMock.expectOne(`${environment.api_url}/search_meeting_points`);
        expect(req.request.method).toBe('GET');
    });

    it('should create meeting point', async () => {
        service.post_meeting_point(MEETING_POINT_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/create_meeting_point`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.lat).toBe(MEETING_POINT_OBJECT.lat);
    });

    it('should delete meeting point', async () => {
        service.delete_meeting_point('1');
        const req = httpMock.expectOne(`${environment.api_url}/delete_meeting_point/1`);
        expect(req.request.method).toBe('POST');
    });
});
