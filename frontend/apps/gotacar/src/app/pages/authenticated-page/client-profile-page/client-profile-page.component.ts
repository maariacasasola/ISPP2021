import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { ImageUploadDialogComponent } from '../../../components/image-upload-dialog/image-upload-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'frontend-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.scss'],
})
export class ClientProfilePageComponent {
  user;

  constructor(
    private _authService: AuthServiceService,
    private _user_service: UsersService,
    public router: Router,
    private _my_dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.load_user_data();
  }

  async load_user_data() {
    try {
      this.user = await this._authService.get_user_data();
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

  async deleteAccount() {
    try {
      await this._user_service.delete_account();
      this._authService.delete_account();
      this._authService.sign_out();
    } catch (error) {
      if(error.error.message==='El usuario tiene reservas pendientes'){
        this._snackBar.open('La cuenta no puede ser borrada, tienes reservas pendientes', null, {
          duration: 3000,
        });
      }
      if(error.error.message==='El usuario tiene viajes pendientes'){
        this._snackBar.open('La cuenta no puede ser borrada, tienes viajes pendientes', null, {
          duration: 3000,
        });
      }
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }

  isDriver() {
    return this._authService.is_driver();
  }
  isClientAndNoDriver(){
    return this._authService.is_client() && !this._authService.is_driver();
  }
  hasCreateRequest(){
    return  this.isClientAndNoDriver() && this.user?.driverStatus!='ACCEPTED';
  }

  async update_profile_photo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
      user_id: this.user.id,
      is_become_driver:false,
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
      const response = await this._user_service.update_profile_photo(
        dialog_response
      );
      if (response) {
        await this.load_user_data();
      }
    } catch (error) {
      this.openSnackBar('No se pudo subir la imagen');
    }
  }

  get_profile_photo() {
    if (this.user?.profilePhoto) {
      return this.user?.profilePhoto;
    }
    return 'assets/img/generic-user.jpg';
  }
  becomeDriver(){
    this.router.navigate(['authenticated/become-driver']);
    
  }
}
