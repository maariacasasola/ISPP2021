import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'apps/gotacar/src/environments/environment';
import { MainFooterComponent } from '../../components/main-footer/main-footer.component';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { AdminGuard } from '../../guards/admin.guard'
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPageComponent, MainHeaderComponent, MainFooterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, AngularFireModule.initializeApp(environment.firebaseConfig), HttpClientTestingModule, MatDialogModule],
      providers: [AdminGuard],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
