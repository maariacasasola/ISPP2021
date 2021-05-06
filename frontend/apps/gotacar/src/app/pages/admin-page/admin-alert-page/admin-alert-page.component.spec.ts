import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
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
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: convertToParamMap({user_email: 'user@gotacar.es'})}}}
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdminAlertPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component.form.controls['message'].setValue('message1');
    component.form.controls['honeypot'].setValue(new FormControl(''));
    expect(component).toBeDefined();
  });

});
