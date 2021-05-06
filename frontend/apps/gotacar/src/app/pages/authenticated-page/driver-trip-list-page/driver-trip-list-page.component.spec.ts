import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConvertCentToEurPipe } from '../../../pipes/convert-cent-to-eur.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { Observable } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DriverTripListPageComponent } from './driver-trip-list-page.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'apps/gotacar/src/environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';

class mockTripServiceError{
  load_trips_by_driver(){
    return Observable.throw(new Error('El viaje ya está cancelado'));
  }
}
class mockTripService {
  get_driver_trips() {
    return Promise.resolve([]);
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
  let tripService : TripsService;

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
    tripService = TestBed.inject(TripsService);
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
  
  it('should show error while loading comments', () => {
    const spy = spyOn(component, '_snackbar');
    spyOn(tripService, 'get_driver_trips').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.load_trips_by_driver();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se ha producido un error al cargar los viajes'
      );
    });
  });
  
});
