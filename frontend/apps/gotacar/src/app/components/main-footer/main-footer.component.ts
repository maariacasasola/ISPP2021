import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
})
export class MainFooterComponent implements OnInit {
  constructor(private _authService: AuthServiceService) {}

  ngOnInit(): void {}
  canAccess():boolean{
    return this._authService.is_client() ||  this._authService.is_driver();
  }
}
