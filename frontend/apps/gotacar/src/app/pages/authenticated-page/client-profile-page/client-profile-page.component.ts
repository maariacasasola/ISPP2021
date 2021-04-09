import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../services/auth-service.service';

@Component({
  selector: 'frontend-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.scss'],
})
export class ClientProfilePageComponent implements OnInit {
  name:string= "Pepito";
  constructor(private _userService:AuthServiceService) {
    const name=_userService.get_user_data();
    console.log(name);
  }
  
  ngOnInit(): void {}
}
