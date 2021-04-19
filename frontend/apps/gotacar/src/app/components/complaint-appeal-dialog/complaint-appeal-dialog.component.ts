import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComplaintAppealsService } from '../../services/complaint-appeals.service';

@Component({
  selector: 'complaint-appeal-dialog',
  templateUrl: './complaint-appeal-dialog.component.html',
  styleUrls: ['./complaint-appeal-dialog.component.scss'],
})
export class ComplaintAppealDialogComponent {
  complaintAppealForm: FormGroup = new FormGroup({
    content: new FormControl(''),
  });
  constructor(
    public router: Router,
    private _dialog_ref: MatDialogRef<ComplaintAppealDialogComponent>,
    private _complaint_appeals_service: ComplaintAppealsService,
    private _snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) {}

  close() {
    this._dialog_ref.close();
  }

  async create_complaint_appeal() {
    try {
      if (this.data == null) {
        const new_complaint_appeal = {
          content: this.complaintAppealForm.value.content || '',
        };
        const response = await this._complaint_appeals_service.create_complaint_appeal_complaint(
          new_complaint_appeal
        );
        if (response) {
          this.show_correct_appeal_snackbar();
        }
      } else {
        const new_complaint_appeal = {
          content: this.complaintAppealForm.value.content || '',
          tripId: this.data
        };
        const response = await this._complaint_appeals_service.create_complaint_appeal_banned(new_complaint_appeal);
        if (response) {
          this.show_correct_appeal_snackbar();
        }
      }
      this._dialog_ref.close();
    } catch (error) {
      console.error(error);
    }
  }
  
  private show_correct_appeal_snackbar() {
    this._snackbar.open('Su apelación se ha registrado correctamente', null, {
      duration: 3000,
    });
  }
}
