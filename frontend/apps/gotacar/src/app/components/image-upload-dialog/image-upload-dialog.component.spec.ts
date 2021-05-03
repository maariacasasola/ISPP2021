import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "apps/gotacar/src/environments/environment";
import { ImageUploadDialogComponent } from "./image-upload-dialog.component";

describe('ImageUploadDialogComponent', () => {
    let component: ImageUploadDialogComponent;
    let fixture: ComponentFixture<ImageUploadDialogComponent>;
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, MatDialogModule, MatSnackBarModule, AngularFireModule.initializeApp(environment.firebaseConfig),],
            declarations: [ImageUploadDialogComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: mockDialogRef },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageUploadDialogComponent);
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

    it('#toggleHover() should toggle hover', () => {
        component.isHovering = false;
        component.toggleHover(true);
        fixture.detectChanges();
        expect(component.isHovering).toBe(true);
    });

    it('should open snackbar', () => {
        const spy = spyOn(component._snackBar, 'open');
        fixture.detectChanges();
        component.openSnackBar('hola');
        expect(spy).toHaveBeenCalledWith('hola', null, {
            duration: 3000,
        });
    });
});