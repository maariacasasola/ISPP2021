import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import moment = require('moment');
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { AuthServiceService } from './auth-service.service';

describe('Testing auth service', () => {
  let service;
  let email;
  let password;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([
          {
            path: 'home',
            component: HomePageComponent,
          },
          {
            path: 'log-in',
            component: HomePageComponent,
          },
        ]),
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [AngularFireAuth],
    });
    injector = getTestBed();
    service = TestBed.inject(AuthServiceService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates an account', async () => {
    const randomString = () =>
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    email = `${randomString()}@${randomString()}.test`;
    password = randomString();
    const result = await service.sign_up(email, password);
    expect(result).toBeDefined();
  });

  it('logs users in', async () => {
    const spy = spyOn(service, 'set_user_data');
    await service.sign_in(email, password);
    expect(spy).toHaveBeenCalled();
  });

  it('logs user out', async () => {
    localStorage.setItem('token', 'asdfasdfs');
    await service.sign_out();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('logs users in once more', async () => {
    const spy = spyOn(service, 'set_user_data');
    await service.sign_in(email, password);
    expect(spy).toHaveBeenCalled();
  });

  it('should delete an account', async () => {
    const result = await service.delete_account();
  });

  it('should update password', async () => {
    const result = await service.update_password();
  });
  
  it('should update email', async () => {
    const result = await service.update_email();
  });

  it('does not log users in when the email and password are invalid', async () => {
    const spy = spyOn(service, 'handle_firebase_auth_error');
    const loginResult = await service.sign_in(
      'invalid@email.invalid',
      'password'
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should return an okay at register', () => {
    service.register({
      firstName: 'Moises',
    });

    const req = httpMock.expectOne(`${environment.api_url}/user/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.firstName).toBe('Moises');
  });

  it('should check if user is logged in', () => {
    localStorage.setItem('user', JSON.stringify(true));
    expect(service.is_logged_in()).toBeTruthy();
  });

  

  it('should check if user is admin', () => {
    localStorage.setItem('user', JSON.stringify(true));
    localStorage.setItem('roles', JSON.stringify(['ROLE_ADMIN']));

    expect(service.is_admin()).toBeTruthy();
  });

  it('should check if user is client', () => {
    localStorage.setItem('user', JSON.stringify(true));
    localStorage.setItem('roles', JSON.stringify(['ROLE_CLIENT']));

    expect(service.is_client()).toBeTruthy();
  });

  it('should check if user is driver', () => {
    localStorage.setItem('user', JSON.stringify(true));
    localStorage.removeItem('roles');
    localStorage.setItem('roles', JSON.stringify(['ROLE_CLIENT']));

    expect(service.is_driver()).toBeFalsy();
  });

  it('should check if user is banned', () => {
    expect(service.user_is_banned()).toBeFalsy();
  });

  it('should get user data', () => {
    service.get_user_data();

    const req = httpMock.expectOne(`${environment.api_url}/current_user`);
    expect(req.request.method).toBe('GET');
  });

  it('should get user data fron local storage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'moises@gmail.com' }));
    expect(service.get_user().email).toBe('moises@gmail.com');
  });

  it('should handle error from fireabase', () => {
    const spy = spyOn(service._snackbar, 'open');
    const error = {
      code: 'auth/wrong-password',
    };
    service.handle_firebase_auth_error(error);
    expect(spy).toHaveBeenCalledWith('Contraseña incorrecta', null, {
      duration: 3000,
    });
  });

  it('should handle error from fireabase', () => {
    const spy = spyOn(service._snackbar, 'open');
    const error = {
      code: 'auth/invalid-email',
    };
    service.handle_firebase_auth_error(error);
    expect(spy).toHaveBeenCalledWith('Introduce tu email correctamente', null, {
      duration: 3000,
    });
  });

  it('should handle error from fireabase', () => {
    const spy = spyOn(service._snackbar, 'open');
    const error = {
      code: 'auth/user-not-found',
    };
    service.handle_firebase_auth_error(error);
    expect(spy).toHaveBeenCalledWith(
      'No hay ningún usuario registrado con este email',
      null,
      {
        duration: 3000,
      }
    );
  });

  it('should handle error from fireabase', () => {
    const spy = spyOn(service._snackbar, 'open');
    const error = {
      code: 'check default',
    };
    service.handle_firebase_auth_error(error);
    expect(spy).toHaveBeenCalledWith(
      'Ha ocurrido un error al iniciar tu sesión',
      null,
      {
        duration: 3000,
      }
    );
  });

  it('should update user profile data', () => {
    service.update_user_profile({
      firstName: 'Moises2',
    });

    const req = httpMock.expectOne(`${environment.api_url}/user/update`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.firstName).toBe('Moises2');
  });

  it('should get user token', () => {
    service.get_token(1);

    const req = httpMock.expectOne(`${environment.api_url}/user?uid=1`);
    expect(req.request.method).toBe('POST');
  });
});
