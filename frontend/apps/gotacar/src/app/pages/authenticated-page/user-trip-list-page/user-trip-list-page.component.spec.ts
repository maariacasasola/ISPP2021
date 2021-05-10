import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { TripOrderTypePipe } from '../../../pipes/trip-order-type.pipe';
import { TripsService } from '../../../services/trips.service';
import { TripOrder } from '../../../shared/services/trip-order';
import { UserTripListPageComponent } from './user-trip-list-page.component';
import { AuthServiceService } from '../../../services/auth-service.service';

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

let TRIP_OBJECT: TripOrder = {
  date: new Date(2021, 6, 4, 13, 30, 24),
  price: 300,
  paymentIntent: null,
  places: 2,
  status: 'PROCCESSING',
  user: {
    id: '6072f5bfff1aa84899c35742',
    firstName: 'Juan',
    lastName: 'Perez',
    uid: 'Ej7NpmWydRWMIg28mIypzsI4Bgm2',
    email: 'client@gotacar.es',
    dni: '80808080R',
    profilePhoto: null,
    birthdate: new Date(2021, 6, 4, 13, 30, 24),
    roles: ['ROLE_CLIENT'],
    token: 'Ej7NpmWydRWmIg28mIypzsI4BgM2',
    emailVerified: true,
    timesBanned: null,
  },
  trip: {
    cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
    comments: '',
    end_date: new Date(2021, 3, 4, 13, 30, 24),
    start_date: new Date(2021, 3, 4, 13, 30, 24),
    ending_point: location2,
    starting_point: location1,
    places: 3,
    price: 200,
  },
};

class mockTripService {
  public get_trip(): Observable<TripOrder> {
    return of(TRIP_OBJECT);
  }

  public get_trips() {
    return of([]);
  }
}

class mockAuthService {
  public sign_out() {
    return;
  }
}

describe('UserTripListPageComponent', () => {
  let component: UserTripListPageComponent;
  let fixture: ComponentFixture<UserTripListPageComponent>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        TripOrderTypePipe,
        CurrencyPipe,
        { provide: TripsService, useClass: mockTripService },
        { provide: Router, useValue: routerSpy },
        { provide: AuthServiceService, useClass: mockAuthService },
      ],
      declarations: [UserTripListPageComponent, TripOrderTypePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  it('should open cancel trip dialog', () => {
    spyOn(component, 'cancel_trip_order_dialog');
    component.cancel_trip_order_dialog('1', false);
    fixture.detectChanges();
  });

  it('should get right coordinates', () => {
    spyOn(component, 'get_trip_status');
    component.get_trip_status('PENDING');
    fixture.detectChanges();
    expect(component.get_trip_status).toHaveBeenCalled();
  });

  it('should show complaint button', () => {
    spyOn(component, 'show_complaint_button');
    component.get_trip_status(TRIP_OBJECT);
    fixture.detectChanges();
    expect(component.show_complaint_button).toBeTruthy();
  });

  it('should show cancelation button', () => {
    spyOn(component, 'show_cancelation_button');
    component.show_cancelation_button(TRIP_OBJECT);
    fixture.detectChanges();
    expect(component.show_cancelation_button).toBeTruthy();
  });

  it('should go to trip', () => {
    spyOn(component, 'go_to_trip');
    component.go_to_trip(1);
    fixture.detectChanges();
    expect(component.go_to_trip).toHaveBeenCalled();
  });

  it('should redirect to create complaints', () => {
    component.create_complaint('1');
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/',
      'authenticated',
      'trips',
      '1',
      'create-complaint',
    ]);
  });

  it('should set type of trip to all', () => {
    component.set_type('all');
    fixture.detectChanges();
    expect(component.filter.type).toBe('all');
  });

  it('should set type of trip to completed', () => {
    component.set_type('completed');
    fixture.detectChanges();
    expect(component.filter.type).toBe('completed');
  });

  it('should set type of trip to pending', () => {
    component.set_type('pending');
    fixture.detectChanges();
    expect(component.filter.type).toBe('pending');
  });

  it('should get type of trip status', () => {
    expect(component.get_trip_status("PROCCESSING")).toContain("Procesando pago");
    expect(component.get_trip_status("REFUNDED_PENDING")).toContain("Devolución pendiente");
    expect(component.get_trip_status("REFUNDED")).toContain("Devolución completada");
    expect(component.get_trip_status("PAID")).toContain("Pago realizado");
    expect(component.get_trip_status("CANT_REFUND")).toContain("Devolución denegada");
  });

  it('should go to trip', (() => {
    component.go_to_trip(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/",
      "trip",
      1,]);
  }));

  it('should show complaint button', ()=>{
    component.show_complaint_button(TRIP_OBJECT);
    fixture.detectChanges();
    expect(component.show_complaint_button(TRIP_OBJECT)).toBe(false);
  });

  it('should show complaint button', ()=>{
    const new_trip={
      trip:{
      startDate: new Date(2021,4,2),},
      can_complain:true,
    };
    component.show_complaint_button(new_trip);
    fixture.detectChanges();
    expect(component.show_complaint_button(new_trip)).toBe(true);
  });

  it('should show cancelation button', ()=>{
    const new_trip={
      status: 'PAID',
      trip:{
        startDate: new Date(2022,4,2),},
    };
    component.show_cancelation_button(new_trip);
    fixture.detectChanges();
    expect(component.show_cancelation_button(new_trip)).toBe(true);
  });

  it('should not show cancelation button due to status', ()=>{
    const new_trip={
      status: 'REFUNDED_PENDING',
      trip:{
        startDate: new Date(2022,4,2),},
    };
    component.show_cancelation_button(new_trip);
    fixture.detectChanges();
    expect(component.show_cancelation_button(new_trip)).toBe(false);
  });

  it('should not show cancelation button due to start date', ()=>{
    const new_trip={
      status: 'PAID',
      trip:{
        startDate: new Date(2021,4,2),},
    };
    component.show_cancelation_button(new_trip);
    fixture.detectChanges();
    expect(component.show_cancelation_button(new_trip)).toBe(false);
  });
});
