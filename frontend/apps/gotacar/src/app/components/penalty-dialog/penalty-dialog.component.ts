import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'frontend-penalty-dialog',
  templateUrl: './penalty-dialog.component.html',
  styleUrls: ['./penalty-dialog.component.scss']
})
export class PenaltyDialogComponent implements OnInit {
  minDate: string;
  penalty_form = this._form_builder.group({
    date_banned: ['', Validators.required],
    
  });

  constructor(private _form_builder: FormBuilder,private _dialogRef: MatDialogRef<PenaltyDialogComponent>,) { 
    
    
    this.minDate = new Date().toISOString().slice(0, 16);
  
  }

  ngOnInit(): void {
  }

  onSubmit(){
    
    this._dialogRef.close(this.penalty_form.value);
    
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

}
