import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ComplaintAppealsService } from '../../services/complaint-appeals.service';
import { ComplaintAppealDialogComponent } from './complaint-appeal-dialog.component';

class mockComplaintsService {
  public create_complaint_appeal_complaint() {
    return of({
      driver: {},
      complaint: {},
      content:
        'El retraso fue causado por necesidades personales, suelo ser puntual',
      checked: false,
    });
  }

  public create_complaint_appeal_banned() {
    return of({
      driver: {},
      complaint: {},
      content:
        'El retraso fue causado por necesidades personales, suelo ser puntual',
      checked: false,
    });
  }
}

const mockDialogRef = {
  close: jasmine.createSpy('close'),
};

describe('ComplaintAppealDialogComponent', () => {
  let component: ComplaintAppealDialogComponent;
  let fixture: ComponentFixture<ComplaintAppealDialogComponent>;
  let appealsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplaintAppealDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: '' },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ComplaintAppealsService, useClass: mockComplaintsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintAppealDialogComponent);
    component = fixture.componentInstance;
    appealsService = TestBed.inject(ComplaintAppealsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('#close() should close dialog', () => {
    component.close();
    fixture.detectChanges();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  // it('should create appeal without ', () => {
  //   component.data = {tripId: null};
  //   spyOn(appealsService, 'create_complaint_appeal_complaint');
  //   const spy = spyOn(component, 'show_correct_appeal_snackbar');
  //   component.create_complaint_appeal();
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     expect(spy).toHaveBeenCalled();
  //   });
  // });

  // it('should create appeal without ', () => {
  //     spyOn(appealsService, 'create_complaint_appeal_complaint').and.throwError('error');
  //     const spy = spyOn(component, '_snackbar');
  //     component.create_complaint_appeal();
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       fixture.detectChanges();
  //       expect(spy).toHaveBeenCalledWith('Ha ocurrido un error', null, {
  //         duration: 3000,
  //       });
  //     });
  //   });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackbar, 'open');
    fixture.detectChanges();
    component.show_correct_appeal_snackbar();
    expect(spy).toHaveBeenCalledWith('Su apelación se ha registrado correctamente', null, {
      duration: 3000,
    });
  });
});
