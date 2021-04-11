import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';

@Component({
  selector: 'frontend-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.scss'],
})
export class ClientProfilePageComponent implements OnInit {

  data;
  constructor(private _userService:AuthServiceService,public router: Router,) {
    const name=_userService.get_user_data().then(data=>this.data=data);
   
  }
  
  ngOnInit(): void {}
  goToEditDriver(){
    this.router.navigate(['authenticated/edit-profile']);
  }
  goToEditClient(){
    this.router.navigate(['authenticated/edit-profile-client']);
  }
  

  isDriver() {
    return this._userService.is_driver();
  }
}
