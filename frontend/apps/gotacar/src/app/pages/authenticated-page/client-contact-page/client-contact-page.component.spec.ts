import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientContactPageComponent],
      imports: [HttpClientTestingModule, MatFormFieldModule],
      providers: [
        FormBuilder,
        { provide: TripsService, useClass: mockTripService },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ClientContactPageComponent);
        component = fixture.componentInstance;
      });
  });

  it('should create', () => {
    component.form.controls['name'].setValue('name1');
    component.form.controls['email'].setValue('email1@gmail.com');
    component.form.controls['message'].setValue('message1');
    component.form.controls['honeypot'].setValue(new FormControl(''));
    expect(component).toBeDefined();
  });
});
