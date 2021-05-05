import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'frontend-rating-user-dialog',
  templateUrl: './rating-user-dialog.component.html',
  styleUrls: ['./rating-user-dialog.component.scss']
})
export class RatingUserDialogComponent {
  rating;
  to;
  idTrip;
  rating_form = this._form_builder.group({
    content: ['', Validators.required],
  });
  constructor(@Inject(MAT_DIALOG_DATA) data,
    private _dialogRef: MatDialogRef<RatingUserDialogComponent>,
    public _snackBar: MatSnackBar, private _form_builder: FormBuilder,) {
    this.to = data.to;
    this.idTrip = data.trip_id;
  }

  onSubmit() {
    if (this.rating_form.invalid) {
      this.rating_form.markAllAsTouched();
      return;
    }

    if (this.rating === undefined) {
      this.openSnackBar('Debes proporcionar una valoración estrella');
      return;
    }
    try {
      const data = {
        to: this.to,
        content: this.rating_form.value.content,
        points: this.rating,
        trip_id: this.idTrip,
      }

      this._dialogRef.close(data);
    } catch (error) {
      this.openSnackBar(
        'Ha ocurrido un error al valorar al usuario'
      );

    }

  }
  set_rating(rating) {
    this.rating = rating;
  }
  close() {
    this._dialogRef.close();
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }


}
