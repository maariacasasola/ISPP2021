import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormBuilder } from '@angular/forms';
import { CreateTripDriverComponent } from './create-trip-driver.component';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CreateTripDriverComponent', () => {
  let component: CreateTripDriverComponent;
  let fixture: ComponentFixture<CreateTripDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTripDriverComponent ],
      providers: [
        { provide: FormBuilder},{
          provide:MatSnackBar
        }
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CreateTripDriverComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
