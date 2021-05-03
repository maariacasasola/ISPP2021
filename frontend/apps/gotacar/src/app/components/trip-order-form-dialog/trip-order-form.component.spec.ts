import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TripOrderFormDialogComponent } from "./trip-order-form-dialog.component";

describe('TripOrderFormDialogComponent', () => {
    let component: TripOrderFormDialogComponent;
    let fixture: ComponentFixture<TripOrderFormDialogComponent>;
    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [TripOrderFormDialogComponent],
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
            { provide: MatDialogRef, useValue: mockDialogRef },
            { provide: MAT_DIALOG_DATA, useValue: {} },
        ]
      }).compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(TripOrderFormDialogComponent);
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

    it('#submit() should close dialog', () => {
        component.submit();
        expect(mockDialogRef.close).toHaveBeenCalled();
      });
});  