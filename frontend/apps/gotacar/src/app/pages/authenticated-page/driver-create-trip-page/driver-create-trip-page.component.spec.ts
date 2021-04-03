import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCreateTripPageComponent } from './driver-create-trip-page.component';

describe('DriverCreateTripPageComponent', () => {
  let component: DriverCreateTripPageComponent;
  let fixture: ComponentFixture<DriverCreateTripPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverCreateTripPageComponent],
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
