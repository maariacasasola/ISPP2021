import { Component } from '@angular/core';
import { complaints } from '../../../complaints'

@Component({
  selector: 'frontend-admin-complaints-list-page',
  templateUrl: './admin-complaints-list-page.component.html',
  styleUrls: ['./admin-complaints-list-page.component.scss']
})
export class AdminComplaintsListPageComponent{

  complaints = complaints

}
