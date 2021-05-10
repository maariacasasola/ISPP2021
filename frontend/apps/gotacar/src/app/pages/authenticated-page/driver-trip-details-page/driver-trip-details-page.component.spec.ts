import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DriverTripDetailsPageComponent } from './driver-trip-details-page.component';
import { ConvertCentToEurPipe } from '../../../pipes/convert-cent-to-eur.pipe';
import { CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { Observable, of } from 'rxjs';
import { Trip } from '../../../shared/services/trip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

const location1 = {
  name: 'Sevilla',
  address: 'Calle Canal 48"',
  lat: 37.3747084,
  lng: -5.9649715,
};

const location2 = {
  name: 'Sevilla',
  address: 'Av. Diego Martínez Barrio',
  lat: 37.37625144174958,
  lng: -5.976345387146261,
};

const USER_OBJECT = {
  id: '2',
  firstName: 'Manuel',
  lastName: 'Fernandez',
  uid: '1',
  email: 'manan@gmail.com',
  dni: '312312312',
  profilePhoto: 'http://dasdasdas.com',
  birthdate: new Date(1994, 6, 4, 13, 30, 24),
  roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
  emailVerified: true,
  timesBanned: 2,
  token: '12312ed2',
};

const USER_OBJECT2 = {
  id: '3',
  firstName: 'Manuel',
  lastName: 'Fernandez',
  uid: '1',
  email: 'manan@gmail.com',
  dni: '312312312',
  birthdate: new Date(1994, 6, 4, 13, 30, 24),
  roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
  emailVerified: true,
  timesBanned: 2,
  token: '12312ed2',
};

const TRIP_OBJECT = {
  cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
  comments: '',
  end_date: new Date(2021, 6, 4, 13, 30, 24),
  start_date: new Date(2021, 6, 4, 13, 30, 24),
  ending_point: location2,
  starting_point: location1,
  places: 3,
  price: 200,
  driver: USER_OBJECT,
};

class mockTripService {
  public get_trip(): Observable<Trip> {
    return of(TRIP_OBJECT);
  }

  public get_users_by_trip() {
    return of([]);
  }
}

describe('DriverTripDetailsPageComponent', () => {
  let component: DriverTripDetailsPageComponent;
  let fixture: ComponentFixture<DriverTripDetailsPageComponent>;
  let tripService;
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      declarations: [DriverTripDetailsPageComponent, ConvertCentToEurPipe],
      providers: [
        ConvertCentToEurPipe,
        CurrencyPipe,
        { provide: TripsService, useClass: mockTripService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTripDetailsPageComponent);
    component = fixture.componentInstance;
    tripService = TestBed.inject(TripsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get profile photo of generic user', () => {
    expect(component.get_user_profile_photo(USER_OBJECT2)).toBe(
      'assets/img/generic-user.jpg'
    );
  });

  it('should get profile photo of user', () => {
    component.trip = TRIP_OBJECT;
    expect(component.get_user_profile_photo(USER_OBJECT)).toBe(
      component.trip.driver.profilePhoto
    );
  });

  it('should check future date', () => {
    expect(component.checkDate(new Date(2020, 12, 3))).toBe(false);
  });

  it('should show error while loading comments', () => {
    const spy = spyOn(component, 'openSnackBar');
    spyOn(tripService, 'get_trip').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.load_trip();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se ha producido un error al cargar el viaje'
      );
    });
  });

  it('should redirect to user ratings', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.go_to_user_ratings(USER_OBJECT);
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'authenticated', 'user-ratings', USER_OBJECT]);
  });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackBar, 'open');
    fixture.detectChanges();
    component.openSnackBar('hola');
    expect(spy).toHaveBeenCalledWith('hola', null, {
      duration: 3000,
    });
  });
});
