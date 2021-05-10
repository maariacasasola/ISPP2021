
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { PaymentReturnsService } from 'apps/gotacar/src/app/services/payment-returns.service';
import { Observable, of } from 'rxjs';
import { PaymentReturn } from '../../../shared/services/payment-return';
import { AdminPaymentReturnsListPageComponent } from './admin-payment-returns-list-page.component';

describe('AdminPaymentReturnsListPageComponent', () => {
    let component: AdminPaymentReturnsListPageComponent;
    let fixture: ComponentFixture<AdminPaymentReturnsListPageComponent>;
    let paymentReturnsService: PaymentReturnsService;

    const PAYMENT_RETURN_OBJECT: PaymentReturn = {
        id: "09sd91823a",
        usuarioFirstName: "Pablo",
        usuarioLastName: "Loureiro",
        cantidad: 3,
        fechaCreacion: new Date(2021, 6, 4, 13, 30, 24),
    }

    const PAYMENT_RETURN_OBJECTS: PaymentReturn[] = [
        PAYMENT_RETURN_OBJECT,
    ]

    class mockPaymentReturnsService {
        public get_all_payment_returns(): Observable<PaymentReturn[]> {
            return of(PAYMENT_RETURN_OBJECTS);
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminPaymentReturnsListPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, MatSnackBarModule],
            providers: [{ provide: PaymentReturnsService, useClass: mockPaymentReturnsService }],
        }).compileComponents();
    });

    beforeEach(() => {
        paymentReturnsService = TestBed.get(PaymentReturnsService);
        fixture = TestBed.createComponent(AdminPaymentReturnsListPageComponent);
        component = fixture.componentInstance;
        paymentReturnsService = TestBed.inject(PaymentReturnsService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list payment returns', () => {
        spyOn(paymentReturnsService, 'get_all_payment_returns').and.returnValue(of(PAYMENT_RETURN_OBJECTS));
    });

    it('should throw error snackbar trying to list payment returns', () => {
        const spy = spyOn(component, 'show_message');
        // fixture.detectChanges();

        spyOn(paymentReturnsService, 'get_all_payment_returns').and.throwError('error');
        // fixture.detectChanges();
        component.load_payment_returns();
        fixture.whenStable().then(() => {
            // fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('Ha ocurrido un error, inténtelo más tarde');
        });
    });

    it('should open snackbar', () => {
        const spy = spyOn(component._snackbar, 'open');
        // fixture.detectChanges();
        component.show_message('hola');
        expect(spy).toHaveBeenCalledWith('hola', null, {
          duration: 3000,
        });
      });
})