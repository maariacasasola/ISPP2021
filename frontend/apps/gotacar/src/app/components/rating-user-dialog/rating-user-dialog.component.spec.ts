import { ComponentFixture, TestBed } from '@angular/core/testing';


import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RatingUserDialogComponent } from './rating-user-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('RatingUserDialogComponent', () => {
  let component: RatingUserDialogComponent;
  let fixture: ComponentFixture<RatingUserDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingUserDialogComponent ],
      imports: [ MatDialogModule,  MatSnackBarModule,FormsModule,
        ReactiveFormsModule,BrowserAnimationsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: mockDialogRef }
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
  it('#close() should close dialog', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  it('should mark form as touched', async () => {
    component.rating_form.setValue({
      content: '',
    });
    fixture.detectChanges();
    const spy = spyOn(component.rating_form, 'markAllAsTouched');
    expect(component.rating_form.valid).toBeFalsy();
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should open snackbar when rating no provided', async () => {
    component.rating_form.setValue({
      content: 'Viaje agradable',
    });
    let rating;
    fixture.detectChanges();
    const spy = spyOn(component, 'openSnackBar');
    expect(component.rating_form.valid).toBeTruthy();
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
    component.close();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  it('should open snackbar', () => {
    spyOn(component, 'openSnackBar');
    component.openSnackBar('hola');
    fixture.detectChanges();
    expect(component.openSnackBar).toHaveBeenCalled();
  });
  it('Should set rating',()=>{
    let rating = "2"
    component.rating=rating
    // spyOn(component,'set_rating');
    component.set_rating(rating);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.rating).toEqual(rating);
      expect(component.set_rating).toHaveBeenCalled();
    });
    

    

  });
 
});
