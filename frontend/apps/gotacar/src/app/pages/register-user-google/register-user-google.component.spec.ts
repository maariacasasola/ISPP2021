import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthServiceService } from '../../services/auth-service.service';
import { SignUpComponent } from '../sign-up/sign-up.component';

import { RegisterUserGoogleComponent } from './register-user-google.component';

class mockTripService {
  async get_user_data() {
    return of({
      name: 'Moises',
    });
  }

  is_driver() {
    return true;
  }
}

describe('RegisterUserGoogleComponent', () => {
  let component: RegisterUserGoogleComponent;
  let fixture: ComponentFixture<RegisterUserGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [SignUpComponent],
      providers: [
        { provide: AuthServiceService, useClass: mockTripService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: of({
                uid: 'asdfasdfasd',
                email: 'moises@moises.com',
              }),
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
