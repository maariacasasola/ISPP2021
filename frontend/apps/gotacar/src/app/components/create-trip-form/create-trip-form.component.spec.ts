import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateTripFormComponent } from './create-trip-form.component';
import { CommonModule } from '@angular/common';
import { TripsService } from '../../services/trips.service';
import { of } from 'rxjs';
import { MeetingPointService } from '../../services/meeting-point.service';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { Router } from '@angular/router';

const meeting_points = [];

class mockTripService {
  public create_trip() {}
}

class mockMeetingService {
  get_all_meeting_points() {
    return of(meeting_points);
  }
}

class mockGeoService {
  get_location_from_address() {
    return of([]);
  }
}

describe('MeetingPointSearchbarResultComponent', () => {
  let component: CreateTripFormComponent;
  let fixture: ComponentFixture<CreateTripFormComponent>;
  let tripService: TripsService;
  let meetingPointService: MeetingPointService;
  let geoService: GeocoderServiceService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        CommonModule,
      ],
      declarations: [CreateTripFormComponent],
      providers: [
        { provide: TripsService, useClass: mockTripService },
        { provide: MeetingPointService, useClass: mockMeetingService },
        { provide: GeocoderServiceService, useClass: mockGeoService },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripFormComponent);
    component = fixture.componentInstance;
    tripService = TestBed.inject(TripsService);
    meetingPointService = TestBed.inject(MeetingPointService);
    geoService = TestBed.inject(GeocoderServiceService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snackbar', () => {
    spyOn(component, 'openSnackBar');
    component.openSnackBar('a,b,c');
    fixture.detectChanges();
    expect(component.openSnackBar).toHaveBeenCalled();
  });

  it('should be valid origin and target', () => {
    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(+23232),
      numeroPasajero: 3,
      comentarios: 'Hola',
      price: 200,
    });
    fixture.detectChanges();
    const result = component.checkOrigen();
    fixture.detectChanges();
    expect(result).toBeTruthy();
  });

  it('should display a matbar with error when origin is not valid', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Calle canal',
      fechaHoraInicio: new Date(2021, 12, 12, 13, 44, 45),
      fechaHoraFin: new Date(2021, 12, 12, 14, 1, 45),
      numeroPasajero: 3,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.checkOrigen()).toBe(false);
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'El origen y el destino del viaje no pueden coincidir',
        null,
        {
          duration: 3000,
        }
      );
    });
  });

  it('should be valid start date and end date', () => {
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 10);

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(),
      fechaHoraFin: end_date,
      numeroPasajero: 3,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    const result = component.checkDates();
    fixture.detectChanges();

    expect(result).toBeTruthy();
  });

  it('should display an error callin a create_trip services', () => {
    const spy = spyOn(component, 'openSnackBar');
    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 12, 12, 13, 44, 45),
      fechaHoraFin: new Date(2021, 12, 12, 14, 1, 45),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });
    fixture.detectChanges();
    spyOn(tripService, 'create_trip').and.throwError('error');
    fixture.detectChanges();
    component.submit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se ha producido un error al crear el viaje'
      );
    });
  });

  it('should select origin meeting point', () => {
    const meeting_point = {
      name: 'name',
      address: 'address',
      lat: 2.323232,
      lng: -2.323232,
    };
    component.selected_meeting_point_origin(meeting_point);
    fixture.detectChanges();
    expect(component.location_origin.name).toBe('name');
  });

  it('should select target meeting point', () => {
    const meeting_point = {
      name: 'name',
      address: 'address',
      lat: 2.323232,
      lng: -2.323232,
    };
    component.selected_meeting_point_target(meeting_point);
    fixture.detectChanges();
    expect(component.location_target.name).toBe('name');
  });

  it('should find meeting points', () => {
    component.meeting_points = [
      {
        name: 'Plaza de sevilla',
      },
      {
        name: 'Calle canal',
      },
    ];

    component.search_meeting_points('canal');
    fixture.detectChanges();
    expect(component.searchbar_meeting_points[0]).toBe(
      component.meeting_points[1]
    );
  });

  it('should not search meeting points', () => {
    component.search_meeting_points('');
    fixture.detectChanges();
    expect(component.searchbar_meeting_points).toBeNull();
  });

  it('should not search meeting points', () => {
    component.search_meeting_points('');
    fixture.detectChanges();
    expect(component.searchbar_meeting_points).toBeNull();
  });

  it('should get an error when you try to create a trip without an hour in advance', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeTruthy();
    fixture.detectChanges();
    expect(component.checkDates()).toBe(
      'Debes crear tu viaje con al menos una hora de antelación'
    );
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
  });

  it('should get an error when you try to create a trip with a distance date', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2011111, 12, 12),
      fechaHoraFin: new Date(2011111, 12, 12),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeTruthy();
    fixture.detectChanges();
    expect(component.checkDates()).toBe(
      'Posiblemente haya introducido una fecha muy lejana'
    );
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
  });

  it('should get an error when you try to create a trip more than a year away', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2024, 12, 12),
      fechaHoraFin: new Date(2024, 12, 12),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeTruthy();
    fixture.detectChanges();
    expect(component.checkDates()).toBe(
      '¿Seguro que quieres reservar a tan largo plazo? No realizamos viajes en el tiempo!'
    );
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
  });

  it('hould get an error when you try to create the end time before the departure time', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 13, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 12, 30, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeTruthy();
    fixture.detectChanges();
    expect(component.checkDates()).toBe(
      'La fecha de llegada tiene que ser posterior a la de salida'
    );
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
  });

  it('should get an error when you create a very long trip', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 11, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 30, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeTruthy();
    fixture.detectChanges();
    expect(component.checkDates()).toBe(
      '¿Seguro que tardas tanto en llegar a tu destino? Comprueba bien la hora de llegada'
    );
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
  });

  it('should get an error when you dont create a trip with the minimum duration', () => {
    const spy = spyOn(component._snackBar, 'open');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 15, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 33, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeTruthy();
    fixture.detectChanges();
    expect(component.checkDates()).toBe(
      '¡Correr al volante es peligroso! Deberías tardar más en llegar a tu destino'
    );
    fixture.detectChanges();
    expect(spy).toBeCalledTimes(1);
  });

  it('should mark invalid form', () => {
    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 15, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 33, 24),
      numeroPasajero: -2,
      comentarios: 'Hola',
      price: -200,
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(component.createTripForm.valid).toBeFalsy();
  });

  it('should return correct origin data', () => {
    const spy_location = spyOn(geoService, 'get_location_from_address');
    const spy = spyOn(component._snackBar, 'open');
    component.createTripForm.setValue({
      origen: 'Calle canal, Sevilla',
      destino: 'Avenida reina mercedes, Sevilla',
      fechaHoraInicio: new Date(2021, 6, 4, 15, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 33, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });
    fixture.detectChanges();
    component.get_origin();
    fixture.detectChanges();
    expect(spy_location).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(0);
    fixture.detectChanges();
  });

  it('should return an error triying to get origin location from address', () => {
    const spy = spyOn(component._snackBar, 'open');
    spyOn(geoService, 'get_location_from_address').and.throwError('error');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 15, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 33, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.get_origin();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se ha producido un error al obtener la localización origen',
        null,
        {
          duration: 3000,
        }
      );
    });
  });

  it('should return an error triying to get target location from address', () => {
    const spy = spyOn(component._snackBar, 'open');
    spyOn(geoService, 'get_location_from_address').and.throwError('error');

    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 15, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 33, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    component.get_target();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se ha producido un error al obtener la localización destino',
        null,
        {
          duration: 3000,
        }
      );
    });
  });

  it('should return an error when return meeting_points', () => {
    const spy = spyOn(component._snackBar, 'open');
    spyOn(meetingPointService, 'get_all_meeting_points').and.throwError(
      'error'
    );

    fixture.detectChanges();
    component.get_all_meeting_points();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se ha producido un error al obtener los puntos de encuentro',
        null,
        {
          duration: 3000,
        }
      );
    });
  });

  it('should display a matbar when form is valid', () => {
    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(2021, 6, 4, 15, 30, 24),
      fechaHoraFin: new Date(2021, 6, 4, 15, 33, 24),
      numeroPasajero: 2,
      comentarios: 'Hola',
      price: 200,
    });
    const spy = spyOn(component, 'openSnackBar');
    const spy_create = spyOn(tripService, 'create_trip').and.returnValue(true);
    const chck = spyOn(component, 'checkDates');
    const navigateSpy = spyOn(router, 'navigate');
    component.submit();
    fixture.detectChanges();
    expect(chck).toHaveBeenCalled();
    expect(spy_create).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Viaje creado correctamente');
      expect(navigateSpy).toHaveBeenCalledWith(['home']);
    });
  });

  it('should check the final price that the driver will receive', () => {
    component.createTripForm.get('price').setValue(2);
    fixture.detectChanges();
    const final_price = component.get_final_price();
    expect(final_price).toBe("1.65");
  });
});
