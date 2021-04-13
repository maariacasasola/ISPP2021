import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBecomeDriverPageComponent } from './client-become-driver-page.component';

describe('ClientBecomeDriverPageComponent', () => {
  let component: ClientBecomeDriverPageComponent;
  let fixture: ComponentFixture<ClientBecomeDriverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBecomeDriverPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBecomeDriverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
