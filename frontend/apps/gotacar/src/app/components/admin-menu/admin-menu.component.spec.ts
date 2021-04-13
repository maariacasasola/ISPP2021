import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { AuthServiceService } from '../../services/auth-service.service';
import { AdminMenuComponent } from './admin-menu.component';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;
  let authService: AuthServiceService;

  class mockAuthService {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatMenuModule],
      providers: [{ provide: AuthServiceService, useClass: mockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    authService = TestBed.inject(AuthServiceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})