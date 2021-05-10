import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthServiceService } from '../../services/auth-service.service';
import { SignUpComponent } from './sign-up.component';

class mockAuthService {
  async get_user_data() {
    return of({
      name: 'Moises',
    });
  }

  is_driver() {
    return true;
  }
}

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        CommonModule,
      ],
      declarations: [SignUpComponent],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.register_form.value.birthdate = new Date(1998, 6, 4);
    component.checkDate();
    fixture.detectChanges();
    expect(component.checkDate()).toBe(true);
  });

  it('should check date and return false', () => {
    component.register_form.value.birthdate = new Date(2098, 6, 4);
    component.checkDate();
    fixture.detectChanges();
    expect(component.checkDate()).toBe(false);
  });


  it('should check date and return false', () => {
    component.register_form.value.birthdate = new Date(2098, 6, 4);
    component.checkDate();
    fixture.detectChanges();
    expect(component.checkDate()).toBe(false);
  });

  it('should enable button when accepted is true', fakeAsync(() => {
    const spy = spyOn(component, 'accepted');
    const checkbox = fixture.debugElement.query(By.css('.example-margin')).nativeElement;
    checkbox.click();
    component.checked(checkbox);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toBeTruthy();
    });
  }));
});
