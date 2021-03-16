import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedPageComponent } from './authenticated-page.component';

describe('AuthenticatedPageComponent', () => {
  let component: AuthenticatedPageComponent;
  let fixture: ComponentFixture<AuthenticatedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticatedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
