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
export class ClientProfilePageComponent {
  user;

  constructor(
    private _userService: AuthServiceService,
    public router: Router,
    private _my_dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.load_user_data();
  }

  async load_user_data() {
    try {
      this.user = await this._userService.get_user_data();
    } catch (error) {
      this.openSnackBar(
        'Ha ocurrido un error al recuperar tu perfil de usuario'
      );
    }
  }

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

  async update_profile_photo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
      user_id: this.user.id,
    };

    const dialogRef = this._my_dialog.open(
      ImageUploadDialogComponent,
      dialogConfig
    );

    const dialog_response = await dialogRef.afterClosed().toPromise();

    if (!dialog_response) {
      return;
    }
    try {
      const user_data = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        profilePhoto: dialog_response,
        birthdate: this.user.birthdate,
        phone: this.user.phone,
        dni: this.user.dni,
      };
      const response = await this._userService.update_user_profile(user_data);
      if (response) {
        await this.load_user_data();
      }
    } catch (error) {
      this.openSnackBar('No se pudo subir la imagen');
    }
  }

  get_profile_photo() {
    return this.user?.profilePhoto || 'assets/img/generic-user.jpg';
  }
}
