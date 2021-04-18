import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { TripsService } from '../../../services/trips.service';
import { Trip } from '../../../shared/services/trip';
import { UserTripListPageComponent } from './user-trip-list-page.component';

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
  end_date: new Date(2021, 3, 4, 13, 30, 24),
  start_date: new Date(2021, 3, 4, 13, 30, 24),
  ending_point: location2,
  starting_point: location1,
  places: 3,
  price: 200,
};

class mockTripService {
  public get_trips() {
    return of([]);
  }

  public get_trip(): Observable<Trip> {
    return of(TRIP_OBJECT);
  }
}

describe('UserTripListPageComponent', () => {
  let component: UserTripListPageComponent;
  let fixture: ComponentFixture<UserTripListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        { provide: TripsService, useClass: mockTripService }
      ],
      declarations: [UserTripListPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTripListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
