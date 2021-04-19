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

describe('ComplaintAppealDialogComponent', () => {
  let component: ComplaintAppealDialogComponent;
  let fixture: ComponentFixture<ComplaintAppealDialogComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close() should close dialog', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
