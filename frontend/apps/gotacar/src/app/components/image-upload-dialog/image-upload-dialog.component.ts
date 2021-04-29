import { Component, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'frontend-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss'],
})
export class ImageUploadDialogComponent {
  isHovering: boolean;
  file: File;
  img_url;
  user_id;
  is_become_driver;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private _dialogRef: MatDialogRef<ImageUploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private storage: AngularFireStorage
  ) {
    this.user_id = data.user_id;
    this.is_become_driver = data.is_become_driver;
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    if (files.length > 1) {
      this.openSnackBar('Maximo una imagen');
      return;
    }

    if (files.item(0).size > 2097152) {
      this.openSnackBar('Peso maximo 2MB');
      return;
    }

    if (
      files.item(0).type !== 'image/jpeg' &&
      files.item(0).type !== 'image/png'
    ) {
      this.openSnackBar('Archivo no soportado');
      return;
    }

    this.file = files.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.img_url = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log('File could not be read: ' + event.target.error.code);
    };
    reader.readAsDataURL(this.file);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }

  select_image() {
    const file_input = document.getElementById(
      'file_input'
    ) as HTMLInputElement;

    file_input.onchange = () => {
      if (file_input.files.length > 1) {
        this.openSnackBar('Maximo una imagen');
        return;
      }

      if (file_input.files.item(0).size > 2097152) {
        this.openSnackBar('Peso maximo 2MB');
        return;
      }

      if (
        file_input.files.item(0).type !== 'image/jpeg' &&
        file_input.files.item(0).type !== 'image/png'
      ) {
        this.openSnackBar('Archivo no soportado');
        return;
      }
      this.file = file_input.files.item(0);
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.img_url = event.target.result;
      };
      reader.onerror = (event: any) => {
        console.log('File could not be read: ' + event.target.error.code);
      };
      reader.readAsDataURL(this.file);
    };

    file_input.click();
  }

  close() {
    this._dialogRef.close();
  }


  get_download_url(storageRef) {
    storageRef.getDownloadURL().subscribe({
      next: (downloadURL) => {
        this._dialogRef.close(downloadURL);
      }
    });
  }

  submit() {
    if (this.is_become_driver) {
      const path = `driving_license/${this.user_id}.webp`;
      const storageRef = this.storage.ref(path);
      const uploadTask = this.storage.upload(path, this.file);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.get_download_url(storageRef);
          })
        )
        .subscribe();
    } else {
      const path = `profile_photos/${this.user_id}.webp`;
      const storageRef = this.storage.ref(path);
      const uploadTask = this.storage.upload(path, this.file);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.get_download_url(storageRef);
          })
        )
        .subscribe();
    }
  }
}
