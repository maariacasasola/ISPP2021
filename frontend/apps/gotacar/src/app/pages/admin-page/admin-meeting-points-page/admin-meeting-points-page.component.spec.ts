import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { MeetingPointService } from '../../../services/meeting-point.service';
import { AdminMeetingPointsPageComponent } from './admin-meeting-points-page.component';

describe('AdminDriverRequestsPageComponent', () => {
    let component: AdminMeetingPointsPageComponent;
    let fixture: ComponentFixture<AdminMeetingPointsPageComponent>;


    class mockMeetingPointService {
       
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminMeetingPointsPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, MatSnackBarModule, BrowserAnimationsModule],
            providers: [{ provide: MeetingPointService, useClass: mockMeetingPointService },],
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
    it('Should reset data when click button',()=>{
        spyOn(component,'toggleDisplayCreation');
        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        fixture.whenStable().then(() => {
            expect(component.toggleDisplayCreation).toHaveBeenCalled();
          });
    
    });
    

});