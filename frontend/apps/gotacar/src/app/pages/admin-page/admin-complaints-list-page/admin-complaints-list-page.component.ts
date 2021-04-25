import { Component } from '@angular/core';
import { ComplaintsService } from '../../../services/complaints.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PenaltyDialogComponent } from '../../../components/penalty-dialog/penalty-dialog.component';
import { Penalty } from '../../../shared/services/penalty';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'frontend-admin-complaints-list-page',
  templateUrl: './admin-complaints-list-page.component.html',
  styleUrls: ['./admin-complaints-list-page.component.scss'],
})
export class AdminComplaintsListPageComponent {
  penalty: Penalty;

  complaints = [];

  constructor(
    private _complaints_service: ComplaintsService,
    public _my_dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {
    this.load_complaints();
  }

  async load_complaints() {
    try {
      this.complaints = await this._complaints_service.get_all_complaints();
    } catch (error) {
      console.error(error);
    }
  }

  async openDialog(data) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id_complaint: data.id,
    };
    const dialogRef = this._my_dialog.open(
      PenaltyDialogComponent,
      dialogConfig
    );
    const dialog_response = await dialogRef.afterClosed().toPromise();
    if (!dialog_response) {
      return;
    }
    try {
      const response = await this._complaints_service.penalty_complaint(
        dialog_response
      );
      if (response) {
        this.openSnackBar(
          'Se acepta la queja de ' +
          data?.user?.firstName +
          ' y se penaliza a su conductor ' +
          response['firstName'] +
          ' ' +
          response['lastName']
        );
      }
      await this.load_complaints();
    } catch (error) {
      this.openSnackBar('No se pudo penalizar, hubo un error');
    }
  }

  async rejectComplaint(complaint) {
    try {
      const response = await this._complaints_service.refuse_complain(
        complaint.id
      );
      if (response) {
        this.openSnackBar(
          'Se rechaza la queja de ' + complaint?.user?.firstName
        );
        await this.load_complaints();
      }
    } catch (error) {
      this.openSnackBar('No se pudo rechazar, hubo un error');
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 5000,
      panelClass: ['blue-snackbar'],
    });
  }

  isPending(data: string): string {
    if (data === 'PENDING') {
      return 'Pendiente';
    }
  }
}
