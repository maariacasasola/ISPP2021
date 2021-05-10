import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'apps/gotacar/src/environments/environment';
import { Observable, of } from 'rxjs';
import { AuthServiceService } from '../../../services/auth-service.service';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../shared/services/user';

import { ClientBecomeDriverPageComponent } from './client-become-driver-page.component';

describe('ClientBecomeDriverPageComponent', () => {
  let component: ClientBecomeDriverPageComponent;
  let fixture: ComponentFixture<ClientBecomeDriverPageComponent>;
  let authService: AuthServiceService;
  let userService: UsersService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  //const matDialog = ;

  const user = {
    id: '6079a04836360235d5389cc6',
    firstName: 'Antonio',
    lastName: 'Fernandez',
    uid: 'jZ1JViuU0ec4d9nuW7R6d5FGCzw2',
    email: 'antonio@gmail.com',
    dni: '4328898D',
    profilePhoto: '',
    birthdate: new Date(),
    roles: ['ROLE_DRIVER', 'ROLE_CLIENT'],
    emailVerified: true,
    token: '',
    timesBanned: 0,
  };
  class MatDialogMock {
    obtain_driving_license() {
      return {
        afterClosed: () => of(true)
      };
    }
  }
  class mockAuthService {
    public get_user_data(): Observable<User> {
      return of(user);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      declarations: [ClientBecomeDriverPageComponent],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: AuthServiceService, useClass: mockAuthService },
        { provide: UsersService, useClass: userService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBecomeDriverPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component.request_form.controls['iban'].setValue('ES1234123412341234');
    component.request_form.controls['experience'].setValue(4);
    component.request_form.controls['car_plate'].setValue('2450GDF');
    component.request_form.controls['enrollment_date'].setValue(new Date());
    component.request_form.controls['model'].setValue('BMW');
    component.request_form.controls['color'].setValue('rojo');
    expect(component).toBeDefined();
  });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackBar, 'open');
    fixture.detectChanges();
    component.openSnackBar('hola');
    expect(spy).toHaveBeenCalledWith('hola', null, {
      duration: 3000,
    });
  });
});
