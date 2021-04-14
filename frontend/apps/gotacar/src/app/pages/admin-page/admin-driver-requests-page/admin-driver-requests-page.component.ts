import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';
@Component({
  selector: 'frontend-admin-driver-requests-page',
  templateUrl: './admin-driver-requests-page.component.html',
  styleUrls: ['./admin-driver-requests-page.component.scss'],
})
export class AdminDriverRequestsPageComponent {
  requests = [];
  constructor(private _users_service: UsersService, private _snackBar: MatSnackBar,
    ) {
    this.load_driver_requests();
  }

  async load_driver_requests() {
    try {
      this.requests = await this._users_service.get_all_driver_requests();
    } catch (error) {
      console.log(error)
      this._snackBar.open("Ha ocurrido un error", null, {
        duration: 3000,
      });
    }
  }

  accept_request(user){
    try{
      this._users_service.convert_to_driver(user?.uid);
    }catch(error){
      console.log(error)
      this._snackBar.open("Ha ocurrido un error", null, {
        duration: 3000,
      });
    }
    window.location.reload();
  }
}
