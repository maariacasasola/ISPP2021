import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { AuthServiceService } from '../../services/auth-service.service';
import { AuthMenuComponent } from './auth-menu.component';
import { Observable, of } from 'rxjs';

describe('AuthMenuComponent', () => {
  let component: AuthMenuComponent;
  let fixture: ComponentFixture<AuthMenuComponent>;
  let authService: AuthServiceService;

  class mockAuthService {
    public is_driver(): Observable<Boolean>{
      return of(true);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatMenuModule],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMenuComponent);
    authService = TestBed.inject(AuthServiceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})