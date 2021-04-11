import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceService } from '../../services/auth-service.service';
import { SignUpComponent } from '../sign-up/sign-up.component';

import { RegisterUserGoogleComponent } from './register-user-google.component';
class mockTripService{
  
}
describe('RegisterUserGoogleComponent', () => {
  let component: RegisterUserGoogleComponent;
  let fixture: ComponentFixture<RegisterUserGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports:[ReactiveFormsModule,
            MatSnackBarModule,
            HttpClientTestingModule,
            BrowserAnimationsModule,
          ],
        declarations: [ SignUpComponent ],
        providers:[{ provide: AuthServiceService, useClass: mockTripService }],
        schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
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
