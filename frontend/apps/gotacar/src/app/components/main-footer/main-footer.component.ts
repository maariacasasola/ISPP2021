import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
})
export class MainFooterComponent {
  constructor(private _authService: AuthServiceService) { }

  canAccess(): boolean {
    return this._authService.is_client() || this._authService.is_driver();
  }
}
