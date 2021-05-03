import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverProfileDataDialogComponent } from './driver-profile-data-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const USER_OBJECT = {
  profilePhoto: 'http://dasdasdas.com',
  birthdate: new Date(1997, 6, 10, 12, 30, 18),
};

const TRIP_OBJECT = {
  driver: USER_OBJECT,
};

describe('DriverProfileDataDialogComponent', () => {
  let component: DriverProfileDataDialogComponent;
  let fixture: ComponentFixture<DriverProfileDataDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverProfileDataDialogComponent],
      imports: [MatDialogModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverProfileDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close() should close dialog', () => {
    component.close();
    fixture.detectChanges();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#get_age() should get driver age', () => {
    component.trip = TRIP_OBJECT;
    component.get_age();
    fixture.detectChanges();
    expect(component.trip.driver.birthdate).toStrictEqual(new Date(1997, 6, 10, 12, 30, 18));
  });

  it('should get profile photo of generic user', () => {
    expect(component.get_profile_photo()).toBe(
      'assets/img/generic-user.jpg'
    );
  });

  it('should get profile photo of user', () => {
    component.trip = TRIP_OBJECT;
    expect(component.get_profile_photo()).toBe(
      component.trip.driver.profilePhoto
    );
  });
});
