import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'apps/gotacar/src/environments/environment';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../../services/auth-service.service';
import { UsersService } from '../../../services/users.service';

import { ClientBecomeDriverPageComponent } from './client-become-driver-page.component';

describe('ClientBecomeDriverPageComponent', () => {
  let component: ClientBecomeDriverPageComponent;
  let fixture: ComponentFixture<ClientBecomeDriverPageComponent>;
  let authService: AuthServiceService;
  let userService: UsersService;

  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      declarations: [ClientBecomeDriverPageComponent],
      providers: [
        FormBuilder,
        { provide: AuthServiceService, useClass: authService },
        { provide: UsersService, useClass: userService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBecomeDriverPageComponent);
    component = fixture.componentInstance;
  });
  

  it('should create', () => {
    component.request_form.controls['iban'].setValue("ES1234123412341234");
    component.request_form.controls['experience'].setValue(4);
    component.request_form.controls['car_plate'].setValue("2450GDF");
    component.request_form.controls['enrollment_date'].setValue(new Date());
    component.request_form.controls['model'].setValue("BMW");
    component.request_form.controls['color'].setValue("rojo");
    expect(component).toBeDefined();
  });

//   it('should load user data', () => {
//     spyOn(tripsService, 'get_all_trip_orders').and.returnValue(of(TRIP_ORDER_OBJECTS));
// })
});
