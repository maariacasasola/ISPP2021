import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceService } from '../../../services/auth-service.service';
import { SignUpComponent } from '../../sign-up/sign-up.component';

import { ClientProfilePageComponent } from './client-profile-page.component';
class mockTripService{
  
}
describe('ClientProfilePageComponent', () => {
  let component: ClientProfilePageComponent;
  let fixture: ComponentFixture<ClientProfilePageComponent>;

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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
