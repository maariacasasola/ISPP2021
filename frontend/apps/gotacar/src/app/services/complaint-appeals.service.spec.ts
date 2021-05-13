import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { ComplaintAppeal } from "../shared/services/complaint-appeal";
import { ComplaintAppealsService } from "./complaint-appeals.service";

const APPEAL_OBJECT: ComplaintAppeal={
    content: 'Llegué tarde por motivos personales'
}

describe('ComplaintAppealsService', () => {
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
        service = TestBed.inject(ComplaintAppealsService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get all complaint appeals', async () => {
        service.get_all_complaints();
        const req = httpMock.expectOne(`${environment.api_url}/complaint_appeals/list`);
        expect(req.request.method).toBe('GET');
    });

    it('should can complaint appeal', async () => {
        service.can_complaint_appeal();
        const req = httpMock.expectOne(`${environment.api_url}/complaint-appeal/driver/check`);
        expect(req.request.method).toBe('GET');
    });

    it('should reject complaint appeal', async () => {
        service.reject_complaint_appeal(15);
        const req = httpMock.expectOne(`${environment.api_url}/complaint_appeals/15/reject`);
        expect(req.request.method).toBe('POST');
    });

    it('should accept complaint appeal', async () => {
        service.accept_complaint_appeal(15);
        const req = httpMock.expectOne(`${environment.api_url}/complaint_appeals/15/accept`);
        expect(req.request.method).toBe('POST');
    });

    it('should create complaint appeal due to banned user', async () => {
        service.create_complaint_appeal_banned(APPEAL_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/complaint-appeal/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.content).toBe(APPEAL_OBJECT.content);
    });

    it('should create complaint appeal due to complaint', async () => {
        service.create_complaint_appeal_complaint(APPEAL_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/complaint-appeal/complaint/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.content).toBe(APPEAL_OBJECT.content);
    });

});