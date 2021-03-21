import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTripListPageComponent } from './admin-trip-list-page.component';

describe('AdminTripListPageComponent', () => {
  let component: AdminTripListPageComponent;
  let fixture: ComponentFixture<AdminTripListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTripListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTripListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
