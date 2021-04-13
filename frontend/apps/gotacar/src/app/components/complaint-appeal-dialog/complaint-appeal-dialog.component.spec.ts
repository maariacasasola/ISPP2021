import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ComplaintsService } from '../../services/complaints.service';
import { ComplaintAppealDialogComponent } from './complaint-appeal-dialog.component';

describe('ComplaintAppealDialogComponent', () => {
  let component: ComplaintAppealDialogComponent;
  let fixture: ComponentFixture<ComplaintAppealDialogComponent>;
  let complaintsService: ComplaintsService;

  class mockComplaintsService {}

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplaintAppealDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatDialogModule,ReactiveFormsModule],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef },{ provide: ComplaintsService, useClass: mockComplaintsService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintAppealDialogComponent);
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
})