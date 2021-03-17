import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPointMapComponent } from './meeting-point-map.component';

describe('MeetingPointMapComponent', () => {
  let component: MeetingPointMapComponent;
  let fixture: ComponentFixture<MeetingPointMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingPointMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPointMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
