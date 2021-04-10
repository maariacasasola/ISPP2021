import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContactPageComponent } from './client-contact-page.component';

describe('ClientContactPageComponent', () => {
  let component: ClientContactPageComponent;
  let fixture: ComponentFixture<ClientContactPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientContactPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientContactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
