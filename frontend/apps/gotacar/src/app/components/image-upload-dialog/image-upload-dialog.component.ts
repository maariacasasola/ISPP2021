import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'frontend-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent implements OnInit {

  isHovering: boolean;
  files: File[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) data,private _dialogRef: MatDialogRef<ImageUploadDialogComponent>,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      console.log(files.item(i));
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
  onClick(){
    const file_input = document.getElementById('file_input')as HTMLInputElement;
    file_input.onchange = () => { 
      if (file_input.files.length + this.files.length > 1){
        this.openSnackBar('Maximo una imagen');
        return;
        }
    if(file_input.files.item(0).size > 2097152){
      this.openSnackBar('Peso maximo 2MB')
      return;
    }
    if(
      file_input.files.item(0).type !=='image/jpeg' &&
      file_input.files.item(0).type !=='image/png'
    ){this.openSnackBar('Archivo no soportado')
      return;
      }
    this.files.push(file_input.files.item(0));
  }
  file_input.click();
  };
  
  }


