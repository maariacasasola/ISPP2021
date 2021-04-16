import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'frontend-admin-user-list-page',
  templateUrl: './admin-user-list-page.component.html',
  styleUrls: ['./admin-user-list-page.component.scss'],
})
export class AdminUserListPageComponent {
  users = [];

  constructor(
    private _users_service: UsersService,
    private _snackbar: MatSnackBar
  ) {
    this.load_users();
  }

  async load_users() {
    try {
      this.users = await this._users_service.get_all_users();
    } catch (error) {
      console.error(error);
    }
  }

  async delete_account(user_id: string) {
    try {
      await this._users_service.delete_penalized_account(user_id);
    } catch (error) {
      if (error.error.message === 'El usuario tiene reservas pendientes') {
        this._snackbar.open('El usuario tiene reservas pendientes', null, {
          duration: 3000,
        });
      }

      if (error.error.message === 'El usuario tiene viajes pendientes') {
        this._snackbar.open('El usuario tiene viajes pendientes', null, {
          duration: 3000,
        });
      }
    }
  }

  get_profile_photo(user) {
    return user.profilePhoto
      ? user.profilePhoto
      : 'assets/img/default-user.jpg';
  }
}
