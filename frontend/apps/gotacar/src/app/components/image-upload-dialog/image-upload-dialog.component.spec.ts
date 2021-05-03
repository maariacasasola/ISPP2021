import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'apps/gotacar/src/environments/environment';
import { ImageUploadDialogComponent } from './image-upload-dialog.component';
import { createMockFileList } from '../../shared/file-testing/file';

describe('ImageUploadDialogComponent', () => {
  let component: ImageUploadDialogComponent;
  let fixture: ComponentFixture<ImageUploadDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
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

  it('should deny while uploading more than one files', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
    ]);
    component.onDrop(files);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('Máximo una imagen');
  });

  it('should deny while uploading very big files', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
    ]);
    Object.defineProperty(files[0], 'size', { value: 1024 * 1024 * 1024 + 1 });
    component.onDrop(files);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('Peso máximo 2MB');
  });

  it('should deny while uploading files that are not photos', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
    ]);
    component.onDrop(files);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('Archivo no soportado');
  });

  it('should upload a file', () => {
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'image/jpeg',
        name: 'test.txt',
      },
    ]);
    Object.defineProperty(files[0], 'type', { value: 'image/jpeg' });
    component.onDrop(files);
    fixture.detectChanges();
  });

  it('should select a file', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
    ]);
    const file_input = document.getElementById('file_input');
    Object.defineProperty(file_input, 'files', { value: files });
    component.select_image();
    file_input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('Archivo no soportado');
  });

  it('should select a file and check that there is a single file', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
    ]);
    const file_input = document.getElementById('file_input');
    Object.defineProperty(file_input, 'files', { value: files });
    component.select_image();
    file_input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('Máximo una imagen');
  });

  it('should select a file and check it´s size', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt',
      },
    ]);
    Object.defineProperty(files[0], 'size', { value: 1024 * 1024 * 1024 * 1 });
    const file_input = document.getElementById('file_input');
    Object.defineProperty(file_input, 'files', { value: files });
    component.select_image();
    file_input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('Peso máximo 2MB');
  });

  it('should select a file and check it´s size', () => {
    const spy = spyOn(component, 'openSnackBar');
    const files: FileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'image/jpeg',
        name: 'test.txt',
      },
    ]);
    Object.defineProperty(files[0], 'type', { value: 'image/jpeg' });
    const file_input = document.getElementById('file_input');
    Object.defineProperty(file_input, 'files', { value: files });
    component.select_image();
    file_input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  });
});
