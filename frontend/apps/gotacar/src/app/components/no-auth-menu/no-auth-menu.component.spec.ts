import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAuthMenuComponent } from './no-auth-menu.component';

describe('NoAuthMenuComponent', () => {
  let component: NoAuthMenuComponent;
  let fixture: ComponentFixture<NoAuthMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAuthMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAuthMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
