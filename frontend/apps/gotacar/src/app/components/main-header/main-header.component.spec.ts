import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SpyLocation } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceService } from '../../services/auth-service.service';
import { MainHeaderComponent } from './main-header.component';
import { Location } from '@angular/common';

class mockAuthService {
  is_admin() {
    return true;
  }
  is_client() {
    return true;
  }
  is_driver() {
    return true;
  }
  is_logged_in() {
    return true;
  }
}

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;
  let authService: AuthServiceService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
      ],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthServiceService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return is driver boolean', () => {
    component.isDriver();
    fixture.detectChanges();
    spyOn(authService, 'is_driver').and.returnValue(true);
  });

  it('should redirect to home', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirect();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should go back', () => {
    const navigateSpy = spyOn(location, 'back');
    component.go_back();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
