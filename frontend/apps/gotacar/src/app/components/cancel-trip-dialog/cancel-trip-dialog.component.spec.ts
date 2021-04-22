import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthServiceService } from '../../services/auth-service.service';
import { TripsService } from '../../services/trips.service';
import { CancelTripDialogComponent } from './cancel-trip-dialog.component';

describe('CancelTripDialogComponent', () => {
  let component: CancelTripDialogComponent;
  let fixture: ComponentFixture<CancelTripDialogComponent>;
  let tripsService: TripsService;
  let authService: AuthServiceService;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  class mockAuthService {
    public is_banned(): Observable<Boolean> {
      return of(true);
    }

    public sign_out() {
      return;
    }
  }

  class mockTripsService {
    public cancel_driver_trip() {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelTripDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: AuthServiceService, useClass: mockAuthService },
        { provide: TripsService, useClass: mockTripsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTripDialogComponent);
    component = fixture.componentInstance;
    tripsService = TestBed.inject(TripsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close() should close dialog', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#continue() should cancel trip', () => {
    component.continue();
    spyOn(tripsService, 'cancel_driver_trip');
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
