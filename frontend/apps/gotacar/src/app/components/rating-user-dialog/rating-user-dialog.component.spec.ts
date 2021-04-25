import { ComponentFixture, TestBed } from '@angular/core/testing';


import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RatingUserDialogComponent } from './rating-user-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('RatingUserDialogComponent', () => {
  let component: RatingUserDialogComponent;
  let fixture: ComponentFixture<RatingUserDialogComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingUserDialogComponent ],
      imports: [ MatDialogModule,  MatSnackBarModule,FormsModule,
        ReactiveFormsModule,],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
