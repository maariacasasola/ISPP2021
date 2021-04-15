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

describe('ClientProfilePageComponent', () => {
  let component: ClientProfilePageComponent;
  let fixture: ComponentFixture<ClientProfilePageComponent>;
  let authService: AuthServiceService;
  let userService: UsersService;
  let router: Router;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
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

  it('should get profile photo without load on database', () => {
    expect(component.get_profile_photo()).toBe('assets/img/generic-user.jpg');
  });
});