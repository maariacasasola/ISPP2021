import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfilePageComponent } from './client-profile-page.component';

describe('ClientProfilePageComponent', () => {
  let component: ClientProfilePageComponent;
  let fixture: ComponentFixture<ClientProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientProfilePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
