import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DriverTripDetailsPageComponent } from './driver-trip-details-page.component';
import { ConvertCentToEurPipe } from '../../../pipes/convert-cent-to-eur.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { Observable, of } from 'rxjs';
import { Trip } from '../../../shared/services/trip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../shared/services/user';
import { MatDialogModule } from '@angular/material/dialog';

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

const TRIP_OBJECT: Trip = {
  cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
  comments: '',
  end_date: new Date(2021, 6, 4, 13, 30, 24),
  start_date: new Date(2021, 6, 4, 13, 30, 24),
  ending_point: location2,
  starting_point: location1,
  places: 3,
  price: 200,
};

const USER_OBJECT: User = {
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
  let h1: HTMLElement;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get profile photo without load on database', () => {
    expect(component.get_user_profile_photo(USER_OBJECT)).toBe(
      'http://dasdasdas.com'
    );
  });

  it('should check future date', () => {
    expect(component.checkDate(new Date(2020, 12, 3))).toBe(false);
  });
});
