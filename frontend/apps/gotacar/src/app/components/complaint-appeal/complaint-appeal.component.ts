import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'complaint-appeal',
  templateUrl: './complaint-appeal.component.html',
  styleUrls: ['./complaint-appeal.component.scss'],
})
export class ComplaintAppealDialogComponent {
  constructor(public router: Router,
    private _dialog_ref: MatDialogRef<ComplaintAppealDialogComponent>,
  ) {}

  close() {
    this._dialog_ref.close();
  }

  create_appeal(){
    this.router.navigate(['complaint-appeal']);
    this.close();
  }
}
