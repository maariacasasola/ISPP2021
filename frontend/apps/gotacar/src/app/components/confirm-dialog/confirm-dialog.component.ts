import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientProfilePageComponent } from '../../pages/authenticated-page/client-profile-page/client-profile-page.component';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    private _dialog_ref: MatDialogRef<ConfirmDialogComponent>
  ) {}

  close() {
    this._dialog_ref.close();
  }

  continue(){
    this._dialog_ref.close(true);
  }
}
