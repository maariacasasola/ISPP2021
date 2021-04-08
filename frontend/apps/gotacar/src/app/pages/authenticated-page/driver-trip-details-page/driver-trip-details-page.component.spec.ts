import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTripDetailsPageComponent } from './driver-trip-details-page.component';

describe('DriverTripDetailsPageComponent', () => {
  let component: DriverTripDetailsPageComponent;
  let fixture: ComponentFixture<DriverTripDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverTripDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTripDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
