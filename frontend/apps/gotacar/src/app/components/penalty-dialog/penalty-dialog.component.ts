import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Penalty } from '../../shared/services/penalty';



@Component({
  selector: 'frontend-penalty-dialog',
  templateUrl: './penalty-dialog.component.html',
  styleUrls: ['./penalty-dialog.component.scss']
})
export class PenaltyDialogComponent implements OnInit {
  id_complaint:string ;
  minDate: string;
  penalty_form = this._form_builder.group({
    date_banned: ['', Validators.required],
    
  });

  constructor( @Inject(MAT_DIALOG_DATA) data,private _form_builder: FormBuilder,private _dialogRef: MatDialogRef<PenaltyDialogComponent>,) { 
    
    this.id_complaint=data.id_complaint;
    this.minDate = new Date().toISOString().slice(0, 16);
  
    console.log(this.id_complaint)
  }

  ngOnInit(): void {
  }

  
  onSubmit(){
    console.log(this.penalty_form.value.date_banned)
    const data:Penalty ={
      id_complaint:this.id_complaint,
      date_banned: new Date(this.penalty_form.value.date_banned),

    }
    
    this._dialogRef.close(data);
    
  }
  
  onNoClick(): void {
    this._dialogRef.close();
  }

}
