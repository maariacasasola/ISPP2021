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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [EditProfileDriverComponent],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
