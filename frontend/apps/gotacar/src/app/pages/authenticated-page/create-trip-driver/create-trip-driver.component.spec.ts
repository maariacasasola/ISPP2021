import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripDriverComponent } from './create-trip-driver.component';

describe('CreateTripDriverComponent', () => {
  let component: CreateTripDriverComponent;
  let fixture: ComponentFixture<CreateTripDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTripDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
