import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'frontend-show-ratings',
  templateUrl: './show-ratings.component.html',
  styleUrls: ['./show-ratings.component.scss']
})
export class ShowRatingsComponent implements OnInit {
  prueba;
  constructor(private _router: Router,private _route: ActivatedRoute,) { 
    this.prueba=this.get_user_id();
  }

  ngOnInit(): void {
  }
  private get_user_id(): string {
    return this._route.snapshot.params['user_id'];
  }

}
