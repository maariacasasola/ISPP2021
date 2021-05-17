import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NoAuthMenuComponent } from './no-auth-menu.component';
import { Router } from '@angular/router';

describe('NoAuthMenuComponent', () => {
  let component: NoAuthMenuComponent;
  let fixture: ComponentFixture<NoAuthMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoAuthMenuComponent],
      imports: [RouterTestingModule, MatMenuModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAuthMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should redirect', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirect();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['log-in']);
  });

  it('should go to sign up', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.gotoSignup();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['sign-up']);
  });
});
