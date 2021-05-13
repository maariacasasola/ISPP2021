import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
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
import { AngularIbanModule } from 'angular-iban';

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

class mockUserService {
  public request_conversion_to_driver() {
    return of(true);
  }
}

describe('ClientBecomeDriverPageComponent', () => {
  let component: ClientBecomeDriverPageComponent;
  let fixture: ComponentFixture<ClientBecomeDriverPageComponent>;
  let authService: AuthServiceService;
  let userService: UsersService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

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
        AngularIbanModule
      ],
      declarations: [ClientBecomeDriverPageComponent],
      providers: [FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: AuthServiceService, useClass: mockAuthService },
        { provide: UsersService, useClass: mockUserService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBecomeDriverPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthServiceService);
    userService=TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should create', () => {
    component.request_form.controls['iban'].setValue('ES1234123412341234');
    component.request_form.controls['experience'].setValue(4);
    component.request_form.controls['car_plate'].setValue('2450GDF');
    component.request_form.controls['enrollment_date'].setValue(new Date());
    component.request_form.controls['model'].setValue('BMW');
    component.request_form.controls['color'].setValue('rojo');
    fixture.detectChanges();
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

  it('should throw error while load user data', () => {
    const spy = spyOn(component, 'openSnackBar');
    fixture.detectChanges();
    spyOn(authService, 'get_user_data').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.load_user_data();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Ha ocurrido un error al recuperar el identificador de usuario');
    });
  });

  it('should enrrollment date and return false due to birthdate', () => {
    component.request_form.value.birthdate = new Date(2098, 6, 4);
    component.request_form.value.enrollment_date = new Date(2010, 6, 4);
    component.checkEnrollmentDateBeforeBirthDate();
    fixture.detectChanges();
    expect(component.checkEnrollmentDateBeforeBirthDate()).toBe(false);
  });

  it('should enrrollment date and return true', () => {
    component.birth_date = new Date(1998, 6, 4);
    component.request_form.value.enrollment_date = new Date(2030, 6, 4);
    component.checkEnrollmentDateBeforeBirthDate();
    fixture.detectChanges();
    expect(component.checkEnrollmentDateBeforeBirthDate()).toBe(true);
  });

  it('should enrrollment date and return false due to enrrollment', () => {
    component.request_form.value.birthdate = new Date(1998, 6, 4);
    component.request_form.value.enrollment_date = new Date(1995, 6, 4);
    component.checkEnrollmentDateBeforeBirthDate();
    fixture.detectChanges();
    expect(component.checkEnrollmentDateBeforeBirthDate()).toBe(false);
  });

  it('should check experience and return true', () => {
    component.request_form.value.experience = 1;
    component.request_form.value.enrollment_date = new Date(2018, 6, 4);
    component.checkExperienciaWithEnrollment();
    fixture.detectChanges();
    expect(component.checkExperienciaWithEnrollment()).toBe(true);
  });

  it('should check experience and return false due to experience', () => {
    component.request_form.value.experience = 3;
    component.request_form.value.enrollment_date = new Date(2018, 6, 4);
    component.checkExperienciaWithEnrollment();
    fixture.detectChanges();
    expect(component.checkExperienciaWithEnrollment()).toBe(false);
  });

  it('should check experience and return false due to enrollment date', () => {
    component.request_form.value.experience = 1;
    component.request_form.value.enrollment_date = new Date(2030, 6, 4);
    component.checkExperienciaWithEnrollment();
    fixture.detectChanges();
    expect(component.checkExperienciaWithEnrollment()).toBe(false);
  });
});
