import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    private _snackbar: MatSnackBar,
    private _router: Router,
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
      await this.load_users();
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
  go_to_user_ratings(user_id) {
    this._router.navigate(['/', 'admin', 'user-ratings', user_id]);
  }

  get_profile_photo(user) {
    return user.profilePhoto
      ? user.profilePhoto
      : 'assets/img/default-user.jpg';
  }
}
