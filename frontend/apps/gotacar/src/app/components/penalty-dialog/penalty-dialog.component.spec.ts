import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PenaltyDialogComponent } from "./penalty-dialog.component";

describe('PenaltyDialogComponent', () => {
    let component: PenaltyDialogComponent;
    let fixture: ComponentFixture<PenaltyDialogComponent>;
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PenaltyDialogComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ReactiveFormsModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
            { provide: MatDialogRef, useValue: mockDialogRef },],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PenaltyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog',()=>{
        component.onNoClick();
        fixture.detectChanges();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should submit data',()=>{
        component.onSubmit();
        fixture.detectChanges();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});