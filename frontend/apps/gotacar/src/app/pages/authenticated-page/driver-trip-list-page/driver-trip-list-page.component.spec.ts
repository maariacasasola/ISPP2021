import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConvertCentToEurPipe } from '../../../pipes/convert-cent-to-eur.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { Observable, of } from 'rxjs';
import { Trip } from '../../../shared/services/trip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../shared/services/user';
import { MatDialogModule } from '@angular/material/dialog';
import { DriverTripListPageComponent } from './driver-trip-list-page.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'apps/gotacar/src/environments/environment';
import moment = require('moment');

class mockTripService{
    get_driver_trips(){
        return [];
    }
}
describe('DriverTripListPageComponent', () => {
  let component: DriverTripListPageComponent;
  let fixture: ComponentFixture<DriverTripListPageComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      declarations: [DriverTripListPageComponent, ConvertCentToEurPipe],
      providers: [
        { provide: TripsService, useClass: mockTripService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTripListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Can cancel', ()=>{
    const startDate = moment().add(3,'hours');
    expect(component.can_cancel(startDate.toString())).toBeTruthy();
  })
  
});
