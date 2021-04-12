import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { ImageUploadDialogComponent } from '../../../components/image-upload-dialog/image-upload-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'frontend-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.scss'],
})
export class ClientProfilePageComponent implements OnInit {
  data;
  constructor(
    private _userService: AuthServiceService,
    public router: Router,
    private _my_dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    const name = _userService
      .get_user_data()
      .then((data) => (this.data = data));
  }

  ngOnInit(): void {}
  goToEditDriver() {
    this.router.navigate(['authenticated/edit-profile']);
  }
  goToEditClient() {
    this.router.navigate(['authenticated/edit-profile-client']);
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }

  isDriver() {
    return this._userService.is_driver();
  }
  async openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this._my_dialog.open(
      ImageUploadDialogComponent,
      dialogConfig
    );

    const dialog_response = await dialogRef.afterClosed().toPromise();

    if (!dialog_response) {
      return;
    }
    try {
      // const response = await this._complaints_service.penalty_complaint(
      //   dialog_response
      // );
    } catch (error) {
      this.openSnackBar('No se pudo subir la imagen');
    }
  }
}
