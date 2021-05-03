import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminAlertPageComponent } from './admin-alert-page.component';

describe('AdminAlertPageComponent', () => {
  let component: AdminAlertPageComponent;
  let fixture: ComponentFixture<AdminAlertPageComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: {} },
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAlertPageComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        RouterTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdminAlertPageComponent);
        component = fixture.componentInstance;
      });
  });

  it('should create', () => {
    component.form.controls['message'].setValue('message1');
    component.form.controls['honeypot'].setValue(new FormControl(''));
    expect(component).toBeDefined();
  });
});
