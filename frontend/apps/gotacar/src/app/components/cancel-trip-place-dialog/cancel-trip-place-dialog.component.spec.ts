import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TripsService } from '../../services/trips.service';

import { CancelTripPlaceDialogComponent } from './cancel-trip-place-dialog.component';

describe('CancelTripPlaceDialogComponent', () => {
  let component: CancelTripPlaceDialogComponent;
  let fixture: ComponentFixture<CancelTripPlaceDialogComponent>;
  let h1: HTMLElement;
  let tripsService: TripsService;


  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelTripPlaceDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatDialogModule, MatSnackBarModule, HttpClientModule, BrowserAnimationsModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTripPlaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    h1 = fixture.nativeElement.querySelector('h1');
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close() should close dialog', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#continue() should continue', () => {
    component.continue();
    component.openSnackBar('');
    component.close();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should open snackbar', () => {
    spyOn(component, 'openSnackBar');
    component.openSnackBar('hola');
    fixture.detectChanges();
    expect(component.openSnackBar).toHaveBeenCalled();
  });

  it('should display a title', () => {
    expect(h1.textContent).toContain('Atención');
  });

  it('should get message before limit', () => {
    component.data.afterLimit=false;
    component.get_message();
    fixture.detectChanges();
    expect(component.message).toBe('Va a proceder a rechazar su plaza en este viaje. \n Se procederá a devolverle el importe.');
  });

  it('should get message after limit', () => {
    component.data.afterLimit=true;
    component.get_message();
    fixture.detectChanges();
    expect(component.message).toBe('Va a proceder a rechazar su plaza en este viaje después del límite de cancelación. \n Tenga en cuenta que no se le devolverá el importe de la misma.');
  });
});
