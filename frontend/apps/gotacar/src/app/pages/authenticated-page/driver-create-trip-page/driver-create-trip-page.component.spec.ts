import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateTripFormComponent } from '../../../components/create-trip-form/create-trip-form.component';

import { DriverCreateTripPageComponent } from './driver-create-trip-page.component';

describe('DriverCreateTripPageComponent', () => {
  let component: DriverCreateTripPageComponent;
  let fixture: ComponentFixture<DriverCreateTripPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverCreateTripPageComponent, CreateTripFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[ReactiveFormsModule, MatSnackBarModule,HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverCreateTripPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
