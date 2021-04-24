import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/complaints.service';
import { ClientComplaintPageComponent } from './client-complaint-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

const complaint = {
    title: '',
    content: '',
    tripId: 0,
}

class complaintsServiceStub {

    public create_complaint() {
        return of('message');
    }
}


describe('ClientComplaintPageComponent', () => {

    let component: ClientComplaintPageComponent;
    let fixture: ComponentFixture<ClientComplaintPageComponent>;
    let complaintService: ComplaintsService;
    let router: Router


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClientComplaintPageComponent],
            imports: [
                HttpClientTestingModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                MatSnackBarModule,
            ],
            providers: [
                { provide: ComplaintsService, useClass: complaintsServiceStub },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClientComplaintPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        complaintService = TestBed.inject(ComplaintsService);
        router = TestBed.inject(Router);
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a correct complaint and throw snackbar confirmation', () => {
        const spy = spyOn(component._snackbar, 'open');
        const spy_create_complaint = spyOn(complaintService, 'create_complaint').and.callThrough();
        const navigateSpy = spyOn(router, 'navigate');

        fixture.detectChanges();

        component.complaintForm.setValue({
            title: 'title',
            content: 'content',
        });

        component.create_complaint();
        fixture.detectChanges();
        expect(spy_create_complaint).toBeCalledTimes(1);

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledTimes(1);
            
        });
    });


});
