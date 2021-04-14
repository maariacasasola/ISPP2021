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
import { User } from '../../../shared/services/user';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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

class mockTripService {
  public get_trip(): Observable<Trip> {
    return of(TRIP_OBJECT);
  }
}

describe('DriverTripDetailsPageComponent', () => {
  let component: DriverTripDetailsPageComponent;
  let fixture: ComponentFixture<DriverTripDetailsPageComponent>;
  let h1: HTMLElement;
  let service: TripsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
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
    h1 = fixture.nativeElement.querySelector('h1');
    fixture.detectChanges();
    service = TestBed.inject(TripsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a title', () => {
    expect(h1.textContent).toContain(component.page_title);
  });

  it('should return trip information', () => {
    spyOn(service, 'get_trip').and.returnValue(of(TRIP_OBJECT));
  });

  it('should return users information', () => {
    expect(service.get_users_by_trip).toBeCalled;
  });

  it('should open confirmation dialog', () => {
    expect(component.active_cancel_dialog).toBeCalled;
  });

  
});
