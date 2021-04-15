import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingUserDialogComponent } from './rating-user-dialog.component';

describe('RatingUserDialogComponent', () => {
  let component: RatingUserDialogComponent;
  let fixture: ComponentFixture<RatingUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
