import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripsService } from '../../../services/trips.service';
import { ClientContactPageComponent } from './client-contact-page.component';

class mockTripService {
  public cancel_user_from_trip() {
    return;
  }
}

describe('ClientProfilePageComponent', () => {
  let component: ClientContactPageComponent;
  let fixture: ComponentFixture<ClientContactPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientContactPageComponent],
      imports: [HttpClientTestingModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: TripsService, useClass: mockTripService },
      ],
    }).compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientContactPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should create', () => {
    component.form.controls['name'].setValue('name1');
    component.form.controls['email'].setValue('email1@gmail.com');
    component.form.controls['message'].setValue('message1');
    component.form.controls['honeypot'].setValue(new FormControl(''));
    expect(component).toBeDefined();
  });

  it('#onSubmit() should submit contact form', () => {
    const spy_disable = spyOn(component.form, 'disable');
    const response = {
      result: 'success',
    }
    component.form.setValue({
      name: 'name',
      email: 'email1@gmail.com',
      message: 'message1',
      honeypot: '',
    });
    component.honeypot.setValue('');
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
    expect(component.honeypot.value).toBe('');
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy_disable).toHaveBeenCalled();
      const req = httpMock.expectOne('https://script.google.com/macros/s/AKfycbwwr5N0tI0DxqCZqflFDt4kXfOxdo0npQW7Lq6z2FbDeauMRds/exec');
      expect(req.request.method).toEqual('POST');
      fixture.detectChanges();
      req.flush(response);
      expect(component.responseMessage).toEqual('Gracias por ponerte en contacto con el equipo de soporte de GotACar. Contactaremos contigo con la mayor brevedad posible.');
    });
  });

  it('#onSubmit() should not submit contact form', () => {
    const spy_disable = spyOn(component.form, 'disable');
    const response = {
      result: 'fail',
    }
    component.form.setValue({
      name: 'name',
      email: 'email1@gmail.com',
      message: 'message1',
      honeypot: '',
    });
    component.honeypot.setValue('');
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
    expect(component.honeypot.value).toBe('');
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy_disable).toHaveBeenCalled();
      const req = httpMock.expectOne('https://script.google.com/macros/s/AKfycbwwr5N0tI0DxqCZqflFDt4kXfOxdo0npQW7Lq6z2FbDeauMRds/exec');
      expect(req.request.method).toEqual('POST');
      fixture.detectChanges();
      req.flush(response);
      expect(component.responseMessage).toEqual('Oops! Algo ha ido mal... ¿Podrías refrescar la página o voler a intentarlo más tarde?.');
    });
  });

  it('#onSubmit() should not submit contact form', () => {
    const spy_disable = spyOn(component.form, 'disable');
    component.form.setValue({
      name: 'name',
      email: 'email1@gmail.com',
      message: 'message1',
      honeypot: '',
    });
    component.honeypot.setValue('');
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
    expect(component.honeypot.value).toBe('');
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy_disable).toHaveBeenCalled();
      const req = httpMock.expectOne('https://script.google.com/macros/s/AKfycbwwr5N0tI0DxqCZqflFDt4kXfOxdo0npQW7Lq6z2FbDeauMRds/exec');
      req.error(new ErrorEvent('Oops! Algo ha ido mal... ¿Podrías refrescar la página o voler a intentarlo más tarde?.'));
    });
  });
});
