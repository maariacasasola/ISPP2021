import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { ComplaintsService } from '../../services/complaints.service';

@Component({
  selector: 'frontend-complaint-appeal-page',
  templateUrl: './complaint-appeal-page.component.html',
  styleUrls: ['./complaint-appeal-page.component.scss'],
})
export class ComplaintAppealPageComponent implements OnInit {
  app_title="Complaint Appeal"

  complaintAppealForm: FormGroup = new FormGroup({
    content: new FormControl(''),
  });

  constructor(public _auth_service: AuthServiceService,private formBuilder: FormBuilder,
    private _complaints_service: ComplaintsService,) {}

  ngOnInit(): void {
  }

  async create_complaint_appeal() {
    try {
      const new_complaint_appeal = {
        complaint: '',
        content: this.complaintAppealForm.value.content || '',
        checked: false,
      };
      await this._complaints_service.create_complaint_appeal(new_complaint_appeal);
      
    } catch (error) {
      console.error(error);
    }
  }
  
}
