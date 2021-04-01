import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'access-forbidden-dialog',
  templateUrl: './access-forbidden-dialog.component.html',
  styleUrls: ['./access-forbidden-dialog.component.scss'],
})
export class AccessForbiddenDialogComponent {
  constructor(
    private _dialog_ref: MatDialogRef<AccessForbiddenDialogComponent>
  ) {}

  close() {
    this._dialog_ref.close();
  }
}
