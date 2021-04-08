import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MeetingPointSearchbarResultComponent } from './meeting-point-searchbar-result.component';

describe('MeetingPointSearchbarResultComponent', () => {
  let component: MeetingPointSearchbarResultComponent;
  let fixture: ComponentFixture<MeetingPointSearchbarResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingPointSearchbarResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPointSearchbarResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on click', () => {
    component.searchbar_meeting_points = [
      {
        name: 'Prueba',
      },
    ];
    spyOn(component.meeting_point_selected, 'emit');
    fixture.detectChanges();

    const native_element = fixture.nativeElement;
    const emitter = native_element.querySelector('.meeting-point');
    emitter.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    expect(component.meeting_point_selected.emit).toHaveBeenCalled();
  });
});
