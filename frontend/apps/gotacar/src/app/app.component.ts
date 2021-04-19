import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { HelloService } from './services/hello.service';

@Component({
  selector: 'frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ top: 0, left: 0, right: 0, bottom: 0 }),
        animate('1s ease-in', style({ left: '-100vw' })),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'gotacar';

  is_loading = true;

  constructor(private _hello_service: HelloService) {
    this._hello_service.hello();
    setTimeout(() => {
      this.is_loading = false;
    }, 3500);
  }
}
