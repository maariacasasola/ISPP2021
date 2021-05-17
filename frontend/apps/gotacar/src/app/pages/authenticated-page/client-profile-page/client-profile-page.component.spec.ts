import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthServiceService } from '../../../services/auth-service.service';
import { UsersService } from '../../../services/users.service';
import { ClientProfilePageComponent } from './client-profile-page.component';

const USER_OBJECT = {
  id: '2',
  firstName: 'Manuel',
  lastName: 'Fernandez',
  uid: '1',
  email: 'manan@gmail.com',
  dni: '312312312',
  profilePhoto: 'http://dasdasdas.com',
  birthdate: new Date(1994, 6, 4, 13, 30, 24),
  roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
  emailVerified: true,
  timesBanned: 2,
  token: '12312ed2',
};

const USER_OBJECT2 = {
  id: '3',
  firstName: 'Manuel',
  lastName: 'Fernandez',
  uid: '1',
  email: 'manan@gmail.com',
  dni: '312312312',
  birthdate: new Date(1994, 6, 4, 13, 30, 24),
  roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
  emailVerified: true,
  timesBanned: 2,
  token: '12312ed2',
};

class mockUsersService {
  delete_account(): Observable<boolean> {
    return of(true)
  }
}

class mockAuthService {
  delete_account(): Observable<boolean> {
    return of(true)
  }

  sign_out(): Observable<boolean> {
    return of(true)
  }

  async get_user_data() {
    return of({
      name: 'Moises',
    });
  }

  is_driver() {
    return of(true);
  }

  is_client(){
    return of(true);
  }
}

describe('ClientProfilePageComponent', () => {
  let component: ClientProfilePageComponent;
  let fixture: ComponentFixture<ClientProfilePageComponent>;
  let authService: AuthServiceService;
  let userService: UsersService;
  let router: Router;
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
      ],
      declarations: [ClientProfilePageComponent],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService }, { provide: UsersService, useClass: mockUsersService }, { provide: Router, useValue: mockRouter }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ClientProfilePageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthServiceService);
    userService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to edit driver profile page', () => {
    expect(component.goToEditDriver()).toBe(expect(router.navigate).toHaveBeenCalledWith(['authenticated/edit-profile']));
  });

  it('should go to edit user profile page', () => {
    expect(component.goToEditClient()).toBe(expect(router.navigate).toHaveBeenCalledWith(['authenticated/edit-profile-client']));
  });

  it('should delete account', () => {
    expect(component.deleteAccount());
    spyOn(userService, 'delete_account').and.returnValue('');
  });

  it('should return boolean is driver', () => {
    component.isDriver();
    spyOn(authService, 'is_driver').and.returnValue(true);
  });

  it('should return boolean is client', () => {
    component.isClientAndNoDriver();
    fixture.detectChanges();
    expect(component.isClientAndNoDriver()).toBe(false);
  });

  it('should get profile photo of generic user', () => {
    component.user=USER_OBJECT2;
    expect(component.get_profile_photo()).toBe(
      'assets/img/generic-user.jpg'
    );
  });

  it('should get profile photo of user', () => {
    component.user=USER_OBJECT;
    expect(component.get_profile_photo()).toBe(
      component.user.profilePhoto
    );
  });

  it('should show error while loading user data', () => {
    const spy = spyOn(component, 'openSnackBar');
    spyOn(authService, 'get_user_data').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.load_user_data();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Ha ocurrido un error al recuperar tu perfil de usuario'
      );
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

  it('should redirect to new driver form', () => {
    component.becomeDriver();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['authenticated/become-driver']);
  });
});