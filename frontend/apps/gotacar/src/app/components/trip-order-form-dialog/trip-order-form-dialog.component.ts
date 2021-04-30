import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'frontend-trip-order-form-dialog',
  templateUrl: './trip-order-form-dialog.component.html',
  styleUrls: ['./trip-order-form-dialog.component.scss'],
})
export class TripOrderFormDialogComponent {
  places_form = new FormControl(1, Validators.required);

  constructor(
    public dialogRef: MatDialogRef<TripOrderFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  submit() {
    this.dialogRef.close({
      places: this.places_form.value,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
