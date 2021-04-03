import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComplaintAppealsService } from '../../../services/complaint-appeals.service';

@Component({
  selector: 'frontend-admin-complaint-appeals-list-page',
  templateUrl: './admin-complaint-appeals-list-page.component.html',
  styleUrls: ['./admin-complaint-appeals-list-page.component.scss'],
})
export class AdminComplaintAppealsListPageComponent {
  complaint_appeals;

  constructor(
    private _complaint_appeals_service: ComplaintAppealsService,
    private _snackbar: MatSnackBar
  ) {
    this.load_complaint_appeals();
  }

  async load_complaint_appeals() {
    try {
      this.complaint_appeals = await this._complaint_appeals_service.get_all_complaints();
    } catch (error) {
      this.show_message('Ha ocurrido un error, inténtelo más tarde');
    }
  }

  async accept_complaint_appeal(complaint_appeal_id) {
    try {
      const response = await this._complaint_appeals_service.accept_complaint_appeal(
        complaint_appeal_id
      );
      this.show_message('Apelación aceptada correctamente');
      await this.load_complaint_appeals();
    } catch (error) {
      this.show_message('Ha ocurrido un error, inténtelo más tarde');
    }
  }

  async reject_complaint_appeal(complaint_appeal_id) {
    try {
      const response = await this._complaint_appeals_service.reject_complaint_appeal(
        complaint_appeal_id
      );
      this.show_message('Apelación rechazada correctamente');
      await this.load_complaint_appeals();
    } catch (error) {
      this.show_message('Ha ocurrido un error, inténtelo más tarde');
    }
  }

  show_message(message) {
    this._snackbar.open(message, null, {
      duration: 3000,
    });
  }
}
