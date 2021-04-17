import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverProfileDataDialogComponent } from './driver-profile-data-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('DriverProfileDataDialogComponent', () => {
  let component: DriverProfileDataDialogComponent;
  let fixture: ComponentFixture<DriverProfileDataDialogComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverProfileDataDialogComponent ],
      imports: [ MatDialogModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
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
});
