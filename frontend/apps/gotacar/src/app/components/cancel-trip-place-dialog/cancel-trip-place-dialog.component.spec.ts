import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { CancelTripPlaceDialogComponent } from './cancel-trip-place-dialog.component';

describe('CancelTripPlaceDialogComponent', () => {
  let component: CancelTripPlaceDialogComponent;
  let fixture: ComponentFixture<CancelTripPlaceDialogComponent>;
  let h1: HTMLElement;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelTripPlaceDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatDialogModule, MatSnackBarModule, HttpClientModule],
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

  it('should open snackbar', () => {
    spyOn(component, 'openSnackBar');
    component.openSnackBar('hola');
    fixture.detectChanges();
    expect(component.openSnackBar).toHaveBeenCalled();
  });

  it('should display a title', () => {
    expect(h1.textContent).toContain('Atención');
  });


});
