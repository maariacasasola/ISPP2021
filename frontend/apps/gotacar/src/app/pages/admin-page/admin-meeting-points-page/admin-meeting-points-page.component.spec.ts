import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMeetingPointsPageComponent } from './admin-meeting-points-page.component';

describe('AdminMeetingPointsPageComponent', () => {
  let component: AdminMeetingPointsPageComponent;
  let fixture: ComponentFixture<AdminMeetingPointsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMeetingPointsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMeetingPointsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
