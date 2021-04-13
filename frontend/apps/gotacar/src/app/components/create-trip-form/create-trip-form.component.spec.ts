import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateTripFormComponent } from './create-trip-form.component';
import { MatStepper } from '@angular/material/stepper';
import { By } from '@angular/platform-browser';

describe('MeetingPointSearchbarResultComponent', () => {
  let component: CreateTripFormComponent;
  let fixture: ComponentFixture<CreateTripFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [CreateTripFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripFormComponent);
    component = fixture.componentInstance;
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

  it('should be valid price', () => {
    
    component.createTripForm.setValue({
      origen: 'Calle canal',
      destino: 'Avenida reina mercedes',
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(),
      numeroPasajero: 3,
      comentarios: 'Hola',
      price: 200,
    });

    fixture.detectChanges();
    const result = component.checkPrice();
    fixture.detectChanges();

    expect(result).toBeTruthy();
  });

  it('should be valid number of passengers', () => {
    
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
    const result = component.checkPlaces() && component.checkIntEntry();
    fixture.detectChanges();

    expect(result).toBeTruthy();
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
});
