import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'frontend-meeting-point-searchbar-result',
  templateUrl: './meeting-point-searchbar-result.component.html',
  styleUrls: ['./meeting-point-searchbar-result.component.scss'],
})
export class MeetingPointSearchbarResultComponent implements OnInit {
  @Input() searchbar_meeting_points;

  @Output() meeting_point_selected = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  meeting_point_selected_emit(meeting_point) {
    this.meeting_point_selected.emit(meeting_point);
  }
}
