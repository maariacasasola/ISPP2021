import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../services/complaints.service';

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
    private _complaints_service: ComplaintsService
  ) {}

  close() {
    this._dialog_ref.close();
  }

  create_complaint_appeal() {
    try {
      const new_complaint_appeal = {
        content: this.complaintAppealForm.value.content || '',
        checked: 'false',
      };
      this._complaints_service.create_complaint_appeal(new_complaint_appeal);
      this._dialog_ref.close();
    } catch (error) {
      console.error(error);
    }
  }
}
