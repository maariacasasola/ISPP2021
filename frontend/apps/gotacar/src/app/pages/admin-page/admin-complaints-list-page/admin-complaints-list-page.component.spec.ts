import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComplaintsListPageComponent } from './admin-complaints-list-page.component';

describe('AdminComplaintsListPageComponent', () => {
  let component: AdminComplaintsListPageComponent;
  let fixture: ComponentFixture<AdminComplaintsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComplaintsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComplaintsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
