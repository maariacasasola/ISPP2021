import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { Complaint } from "../shared/services/complaint";
import { Penalty } from "../shared/services/penalty";
import { ComplaintsService } from "./complaints.service";

const COMPLAINT_OBJECT: Complaint={
    title: 'Recogida tarde',
    content: 'Llegó 15 minutos tarde al punto de salida',
    tripId: '1'
}

const PENALTY_OBJECT: Penalty={
    id_complaint:'2',
    date_banned: new Date(2022,1,1)
}

describe('ComplaintsService', () => {
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
        service = TestBed.inject(ComplaintsService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get all complaint appeals', async () => {
        service.get_all_complaints();
        const req = httpMock.expectOne(`${environment.api_url}/complaints/list`);
        expect(req.request.method).toBe('GET');
    });

    it('should create complaint', async () => {
        service.create_complaint(COMPLAINT_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/complaints/create`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.content).toBe(COMPLAINT_OBJECT.content);
    });

    it('should penalize user due to complaint', async () => {
        service.penalty_complaint(PENALTY_OBJECT);
        const req = httpMock.expectOne(`${environment.api_url}/penalize`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.date_banned).toBe(PENALTY_OBJECT.date_banned);
    });

    it('should refuse complaint', async () => {
        service.refuse_complain('2');
        const req = httpMock.expectOne(`${environment.api_url}/refuse/2`);
        expect(req.request.method).toBe('POST');
    });

    it('should get complaint for user banned', async () => {
        service.get_complaint_for_user_banned('3');
        const req = httpMock.expectOne(`${environment.api_url}/complaint/last/3`);
        expect(req.request.method).toBe('GET');
    });
});