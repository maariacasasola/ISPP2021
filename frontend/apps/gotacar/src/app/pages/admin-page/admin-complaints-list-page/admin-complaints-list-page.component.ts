import { Component } from '@angular/core';
import { ComplaintsService } from '../../../services/complaints.service';

@Component({
  selector: 'frontend-admin-complaints-list-page',
  templateUrl: './admin-complaints-list-page.component.html',
  styleUrls: ['./admin-complaints-list-page.component.scss']
})
export class AdminComplaintsListPageComponent{

  complaints = [];

  constructor(private _complaints_service: ComplaintsService) {
    this.load_complaints();
  }

  async load_complaints() {
    try {
      this.complaints = await this._complaints_service.get_all_complaints();
    } catch (error) {
      console.error(error);
    }
  }
}
