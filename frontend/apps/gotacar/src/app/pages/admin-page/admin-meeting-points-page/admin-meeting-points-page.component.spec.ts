import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { MeetingPointService } from '../../../services/meeting-point.service';
import { AdminMeetingPointsPageComponent } from './admin-meeting-points-page.component';

describe('AdminDriverRequestsPageComponent', () => {
  let component: AdminMeetingPointsPageComponent;
  let fixture: ComponentFixture<AdminMeetingPointsPageComponent>;

  class mockMeetingPointService {
    get_all_meeting_points() {
      return [];
    }
    delete_meeting_point(id) {
      return true;
    }
    post_meeting_point(meetingPoint) {
        const data ={
            address:'hi',
        }
      return data;
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMeetingPointsPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MeetingPointService, useClass: mockMeetingPointService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMeetingPointsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should reset data when click button', () => {
    spyOn(component, 'toggleDisplayCreation');
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.toggleDisplayCreation).toHaveBeenCalled();
    });
  });
  it('Should toggle display', () => {
    component.isShow = true;
    component.toggleDisplayCreation();
    fixture.whenStable().then(() => {
      expect(component.isShow).toEqual(false);
    });
  });
  it('Should reset form', () => {
    component.new_meeting_point.setValue({
      name: 'Punto 1',
      address: 'Calle Canal',
      lat: -37.546,
      lng: 5.6567,
    });
    fixture.detectChanges();
    component.resetForm();
    fixture.detectChanges();
    expect(component.new_meeting_point.valid).toBeFalsy();
  });
  it('Should submit data',()=>{
    const spy = spyOn(mockMeetingPointService.prototype,'post_meeting_point');
    component.onSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
