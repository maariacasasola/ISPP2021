import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'frontend-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
  @Input() title;

  constructor() {}

  ngOnInit(): void {}
}
