import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthServiceService } from '../../../services/auth-service.service';
import { EditProfileDriverComponent } from './edit-profile-driver.component';
import { AngularIbanModule } from 'angular-iban';

class mockAuthService {
  async get_user_data() {
    return of({
      firstName: 'Moisés',
      lastName: 'Calzado',
      email: 'moises122@gmail.com',
      dni: '54545454N',
      birthdate: new Date(),
      phone: '655656776',
      iban: 'ES35454545454645',
      carData: {
        carPlate: '3443MNN',
        enrollmentDate: new Date(),
        model: 'BMW',
        color: 'Rojo',
      },
    });
  }

  is_driver() {
    return true;
  }
}

describe('EditProfileComponent', () => {
  let component: EditProfileDriverComponent;
  let fixture: ComponentFixture<EditProfileDriverComponent>;
  let authService: AuthServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AngularIbanModule
      ],
      declarations: [EditProfileDriverComponent],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileDriverComponent);
    component = fixture.componentInstance;
    authService=TestBed.inject(AuthServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
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
      expect(spy).toHaveBeenCalledWith('Ha ocurrido un error al recuperar tu perfil de usuario');
    });
  });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackBar, 'open');
    fixture.detectChanges();
    component.openSnackBar('hola');
    expect(spy).toHaveBeenCalledWith('hola', null, {
      duration: 3000,
    });
  });

  it('should check date and return true', () => {
    component.update_form.value.birthdate = new Date(1998, 6, 4);
    component.checkDate();
    fixture.detectChanges();
    expect(component.checkDate()).toBe(true);
  });

  it('should check date and return false', () => {
    component.update_form.value.birthdate = new Date(2098, 6, 4);
    component.checkDate();
    fixture.detectChanges();
    expect(component.checkDate()).toBe(false);
  });

  it('should enrrollment date and return false due to birthdate', () => {
    component.update_form.value.birthdate = new Date(2098, 6, 4);
    component.update_form.value.enrollment_date = new Date(2010, 6, 4);
    component.checkEnrollmentDateBeforeBirthDate();
    fixture.detectChanges();
    expect(component.checkEnrollmentDateBeforeBirthDate()).toBe(false);
  });

  it('should enrrollment date and return true', () => {
    component.user.birthdate = new Date(1998, 6, 4);
    component.update_form.value.enrollment_date = new Date(2030, 6, 4);
    component.checkEnrollmentDateBeforeBirthDate();
    fixture.detectChanges();
    expect(component.checkEnrollmentDateBeforeBirthDate()).toBe(true);
  });

  it('should enrrollment date and return false due to enrrollment', () => {
    component.update_form.value.birthdate = new Date(1998, 6, 4);
    component.update_form.value.enrollment_date = new Date(1995, 6, 4);
    component.checkEnrollmentDateBeforeBirthDate();
    fixture.detectChanges();
    expect(component.checkEnrollmentDateBeforeBirthDate()).toBe(false);
  });
});
