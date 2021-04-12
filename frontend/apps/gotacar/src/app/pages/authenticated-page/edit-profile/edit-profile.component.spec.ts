import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthServiceService } from '../../../services/auth-service.service';
import { SignUpComponent } from '../../sign-up/sign-up.component';

import { EditProfileComponent } from './edit-profile.component';

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

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [SignUpComponent],
      providers: [{ provide: AuthServiceService, useClass: mockTripService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});