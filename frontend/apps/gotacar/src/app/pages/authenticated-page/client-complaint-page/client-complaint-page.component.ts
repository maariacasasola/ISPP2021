import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintsService } from '../../../services/complaints.service';

@Component({
  selector: 'frontend-client-complaint-page',
  templateUrl: './client-complaint-page.component.html',
  styleUrls: ['./client-complaint-page.component.scss'],
})
export class ClientComplaintPageComponent {
  complaintForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });
  constructor(
    private _complaints_service: ComplaintsService,
    private route: ActivatedRoute,
    private router: Router,
    public _snackbar: MatSnackBar
  ) { }

  async create_complaint() {
    try {
      const new_complaint = {
        title: this.complaintForm.value.title || '',
        content: this.complaintForm.value.content || '',
        tripId: this.route.snapshot.params['trip'],
      };
      const message = await this._complaints_service.create_complaint(
        new_complaint
      );
      if (message) {
        this._snackbar.open('Queja registrada correctamente', null, {
          duration: 3000,
        });
      }
      this.router.navigate(['home']);
    } catch (error) {
      if (error.error.message === 'El viaje aún no se ha realizado') {
        this._snackbar.open('El viaje aún no se ha realizado', null, {
          duration: 3000,
        });
      }
      if (error.error.message === 'Usted no ha realizado este viaje') {
        this._snackbar.open('Usted no ha realizado este viaje', null, {
          duration: 3000,
        });
      }
      if (error.error.message === 'Ya te has quejado de este viaje') {
        this._snackbar.open('Usted ya ha realizado una queja', null, {
          duration: 3000,
        });
      }
      console.error(error);
    }
  }
}
