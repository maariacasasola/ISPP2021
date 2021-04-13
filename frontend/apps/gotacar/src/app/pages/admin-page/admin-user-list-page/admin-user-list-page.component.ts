import { Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'frontend-admin-user-list-page',
  templateUrl: './admin-user-list-page.component.html',
  styleUrls: ['./admin-user-list-page.component.scss'],
})
export class AdminUserListPageComponent {
  users = [];

  constructor(private _users_service: UsersService) {
    this.load_users();
  }

  async load_users() {
    try {
      this.users = await this._users_service.get_all_users();
    } catch (error) {
      console.error(error);
    }
  }
}
