import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConvertCentToEurPipe } from '../../../pipes/convert-cent-to-eur.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { Observable, of } from 'rxjs';
import { Trip } from '../../../shared/services/trip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../shared/services/user';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DriverTripListPageComponent } from './driver-trip-list-page.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'apps/gotacar/src/environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';

class mockTripService {
  get_driver_trips() {
    return [];
  }
  load_trips_by_driver(){
    return [];
  }
}
describe('DriverTripListPageComponent', () => {
  let component: DriverTripListPageComponent;
  let fixture: ComponentFixture<DriverTripListPageComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate'),
  };
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      declarations: [DriverTripListPageComponent, ConvertCentToEurPipe],
      providers: [
        { provide: TripsService, useClass: mockTripService },
        { provide: Router, useValue: router },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTripListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Can cancel', () => {
    const startDate = moment().add(3, 'hours');
    expect(component.can_cancel(startDate.toString())).toBeTruthy();
  });
  it('navigate', fakeAsync(() => {
    component.go_to_trip(1);
    expect (router.navigate).toHaveBeenCalledWith(["/",
       "authenticated",
       "driver-trips",
       1,]);
  }));
  it('Cancel date error', ()=>{
    component.cancel(1,'2021/04/11');
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
