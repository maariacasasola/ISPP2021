import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MeetingPointService } from '../../../services/meeting-point.service';
import { MeetingPoint } from '../../../shared/services/meeting-point';
import { AdminMeetingPointsPageComponent } from './admin-meeting-points-page.component';

const newMeetingPoint: MeetingPoint = {
  name: 'name',
  address: 'address',
  lat: 37.235,
  lng: -5.4634,
};
class mockMeetingPointService {
  get_all_meeting_points() {
    return [];
  }
  delete_meeting_point(id) {
    return true;
  }
  post_meeting_point(meetingPoint) {

    return of(newMeetingPoint);
  }
}
describe('AdminDriverRequestsPageComponent', () => {
  let component: AdminMeetingPointsPageComponent;
  let fixture: ComponentFixture<AdminMeetingPointsPageComponent>;
  let meetingPointService: MeetingPointService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMeetingPointsPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MeetingPointService, useClass: mockMeetingPointService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMeetingPointsPageComponent);
    component = fixture.componentInstance;
    meetingPointService = TestBed.inject(MeetingPointService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Should reset data when click button', () => {
    spyOn(component, 'toggleDisplayCreation');
    let button = fixture.debugElement.nativeElement.querySelector('button');
    component.toggleDisplayCreation();
    fixture.detectChanges();
    button.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
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
  it('Should submit data', () => {
    const spy = spyOn(meetingPointService, 'post_meeting_point');
    component.onSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('Should delete marker', () => {
    const spy = spyOn(mockMeetingPointService.prototype, 'get_all_meeting_points');
    component.deleteMarker('infoPosition');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should throw error snackbar trying to get meeting points', () => {
    const spy = spyOn(component, 'openSnackBar');
    fixture.detectChanges();
    spyOn(meetingPointService, 'get_all_meeting_points').and.throwError('error');
    fixture.detectChanges();
    component.get_all_meeting_points();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Se ha producido un error al obtener los puntos de encuentro');
    });
  });
});
