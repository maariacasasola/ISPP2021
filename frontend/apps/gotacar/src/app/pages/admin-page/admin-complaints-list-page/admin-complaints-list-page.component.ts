import { Component } from '@angular/core';
import { ComplaintsService } from '../../../services/complaints.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { PenaltyDialogComponent } from '../../../components/penalty-dialog/penalty-dialog.component';
import { Penalty } from '../../../shared/services/penalty';
@Component({
  selector: 'frontend-admin-complaints-list-page',
  templateUrl: './admin-complaints-list-page.component.html',
  styleUrls: ['./admin-complaints-list-page.component.scss']
})
export class AdminComplaintsListPageComponent{
  penalty:Penalty;

  complaints = [];

  constructor(private _complaints_service: ComplaintsService, private _my_dialog: MatDialog) {
    this.load_complaints();
  }

  async load_complaints() {
    try {
      this.complaints = await this._complaints_service.get_all_complaints();
    } catch (error) {
      console.error(error);
    }
  }
  async openDialog(data){
    const dialogConfig = new MatDialogConfig();
   
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    console.log(data.trip)
    dialogConfig.data={
      id_complaint : data.id,
    }
    
   

    const dialogRef = this._my_dialog.open(PenaltyDialogComponent, dialogConfig);
    
    const dialog_response = await dialogRef.afterClosed().toPromise();
    console.log(dialog_response)
    if (!dialog_response) {
      return
    }
    this._complaints_service.penalty_complaint(dialog_response).then(()=>this.load_complaints());
    
    
  }
  rejectComplaint(){
    
  }
  
}
