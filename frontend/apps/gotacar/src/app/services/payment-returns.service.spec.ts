import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { PaymentReturnsService } from "./payment-returns.service";

describe('PaymentReturnsService', () => {
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
        service = TestBed.inject(PaymentReturnsService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get all payment returns', async () => {
        service.get_all_payment_returns();
        const req = httpMock.expectOne(`${environment.api_url}/payment-return/list`);
        expect(req.request.method).toBe('GET');
    });
});
