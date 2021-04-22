import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ComplaintsService } from '../../../services/complaints.service';
import { AdminComplaintsListPageComponent } from './admin-complaints-list-page.component';

class mockComplaintsService {
  get_all_complaints() {
    return [
      {
        content: 'Queja 1',
      },
    ];
  }

  refuse_complain() {
    return of({ message: 'OK' });
  }

  penalty_complaint() {
    return { firstName: 'Antonio', lastName: 'Perez' };
  }
}

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: true }),
    };
  }
}

describe('AdminComplaintsListPageComponent', () => {
  let component: AdminComplaintsListPageComponent;
  let fixture: ComponentFixture<AdminComplaintsListPageComponent>;
  let complaints_service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComplaintsListPageComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        {
          provide: ComplaintsService,
          useClass: mockComplaintsService,
        },
        { provide: MatDialog, useClass: MatDialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComplaintsListPageComponent);
    component = fixture.componentInstance;
    complaints_service = TestBed.inject(ComplaintsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load complaints', () => {
    fixture.detectChanges();
    expect(component.complaints[0].content).toBe('Queja 1');
  });

  it('should show message on error while loading complaints', async () => {
    const spy = spyOn(console, 'error');
    spyOn(complaints_service, 'get_all_complaints').and.throwError('error');
    fixture.detectChanges();
    await component.load_complaints();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('error');
    });
  });

  it('should reject complaint', () => {
    const spy = spyOn(component, 'openSnackBar');
    fixture.detectChanges();
    component.rejectComplaint({
      id: 1,
      user: {
        firstName: 'Moises',
      },
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Se rechaza la queja de Moises');
    });
  });

  it('should show message on error while reject complaint', () => {
    const spy = spyOn(component, 'openSnackBar');
    spyOn(complaints_service, 'refuse_complain').and.throwError('error');
    fixture.detectChanges();
    component.rejectComplaint({
      id: 1,
      user: {
        firstName: 'Moises',
      },
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('No se pudo rechazar, hubo un error');
    });
  });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackBar, 'open');
    fixture.detectChanges();
    component.openSnackBar('hola');
    expect(spy).toHaveBeenCalledWith('hola', null, {
      duration: 5000,
      panelClass: ['blue-snackbar'],
    });
  });

  it('should check if complaint is pending', () => {
    fixture.detectChanges();
    const data = 'PENDING';
    expect(component.isPending(data)).toBe('Pendiente');
  });

  it('should open dialog to accept complaint', async () => {
    const spy = spyOn(component, 'openSnackBar');
    await component.openDialog({
      id: 1,
      user: {
        firstName: 'Moises',
      },
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Se acepta la queja de Moises y se penaliza a su conductor Antonio Perez'
      );
    });
  });

  it('should open dialog when error on accept complaint', async () => {
    const spy = spyOn(component, 'openSnackBar');
    spyOn(complaints_service, 'penalty_complaint').and.throwError('error');
    await component.openDialog({
      id: 1,
      user: {
        firstName: 'Moises',
      },
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('No se pudo penalizar, hubo un error');
    });
  });

  it('should do noting when dialog closed without action', async () => {
    spyOn(component._my_dialog, 'open').and.returnValue({
      afterClosed: () => of(),
    });
    const response = await component.openDialog({
      id: 1,
      user: {
        firstName: 'Moises',
      },
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(response).toBeUndefined();
    });
  });
});
