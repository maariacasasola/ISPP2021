import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormBuilder } from '@angular/forms';
import { CreateTripFormComponent } from './create-trip-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CreateTripFormComponent', () => {
  let component: CreateTripFormComponent;
  let fixture: ComponentFixture<CreateTripFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTripFormComponent ],
      providers: [
        { provide: FormBuilder},{
          provide:MatSnackBar
        }
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CreateTripFormComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});