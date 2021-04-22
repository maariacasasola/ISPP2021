import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ComplaintAppealsService } from '../../../services/complaint-appeals.service';
import { AdminComplaintAppealsListPageComponent } from './admin-complaint-appeals-list-page.component';

class mockComplaintAppealsService {
  get_all_complaints() {
    return [
      {
        content: 'Queja 1',
      },
    ];
  }

  accept_complaint_appeal() {
    return of({ message: 'OK' });
  }

  reject_complaint_appeal() {
    return of({ message: 'OK' });
  }
}

describe('AdminComplaintAppealListComponent', () => {
  let component: AdminComplaintAppealsListPageComponent;
  let fixture: ComponentFixture<AdminComplaintAppealsListPageComponent>;
  let complaint_appeals_service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComplaintAppealsListPageComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: ComplaintAppealsService,
          useClass: mockComplaintAppealsService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComplaintAppealsListPageComponent);
    component = fixture.componentInstance;
    complaint_appeals_service = TestBed.inject(ComplaintAppealsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load complaint appeals', () => {
    fixture.detectChanges();
    expect(component.complaint_appeals[0].content).toBe('Queja 1');
  });

  it('should accept complaint appeal', () => {
    const spy = spyOn(component, 'show_message');
    fixture.detectChanges();
    component.accept_complaint_appeal(1);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Apelación aceptada correctamente');
    });
  });

  it('should show error while accepting complaint appeal', () => {
    const spy = spyOn(component, 'show_message');
    spyOn(complaint_appeals_service, 'accept_complaint_appeal').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.accept_complaint_appeal(1);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Ha ocurrido un error, inténtelo más tarde'
      );
    });
  });

  it('should reject complaint appeal', () => {
    const spy = spyOn(component, 'show_message');
    fixture.detectChanges();
    component.reject_complaint_appeal(1);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Apelación rechazada correctamente');
    });
  });

  it('should show error while rejecting complaint appeal', () => {
    const spy = spyOn(component, 'show_message');
    spyOn(complaint_appeals_service, 'reject_complaint_appeal').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.reject_complaint_appeal(1);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Ha ocurrido un error, inténtelo más tarde'
      );
    });
  });

  it('should show a message on screen', () => {
    const spy = spyOn(component._snackbar, 'open');
    component.show_message('Hola');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
