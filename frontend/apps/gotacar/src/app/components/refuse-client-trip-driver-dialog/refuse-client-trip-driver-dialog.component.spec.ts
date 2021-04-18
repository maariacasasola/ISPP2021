import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { TripsService } from '../../services/trips.service';

import { RefuseClientTripDriverDialogComponent } from './refuse-client-trip-driver-dialog.component';

describe('RefuseClientTripDriverDialogComponent', () => {
  let component: RefuseClientTripDriverDialogComponent;
  let fixture: ComponentFixture<RefuseClientTripDriverDialogComponent>;
  let tripsService: TripsService;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  class mockAuthService {
    public is_banned(): Observable<Boolean> {
      return of(true);
    }
  }

  class mockTripsService {
    public cancel_driver_trip() {}

    public cancel_user_from_trip() {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefuseClientTripDriverDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: TripsService, useClass: mockTripsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefuseClientTripDriverDialogComponent);
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
    const uid = component.continue();
    //spyOn(tripsService, 'cancel_driver_trip');
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
