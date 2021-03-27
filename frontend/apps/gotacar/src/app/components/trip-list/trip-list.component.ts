import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'frontend-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  @Input() trips;

  constructor() {}

  ngOnInit(): void {}
}
