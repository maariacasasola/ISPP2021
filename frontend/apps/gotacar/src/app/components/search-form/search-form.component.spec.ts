import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [SearchFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select origin meeting point', () => {
    const meeting_point = {
      name: 'origen',
    };
    component.selected_meeting_point_origin(meeting_point);
    fixture.detectChanges();
    expect(component.searchForm.get('origin').value).toBe('origen');
  });

  it('should select target meeting point', () => {
    const meeting_point = {
      name: 'target',
    };
    component.selected_meeting_point_target(meeting_point);
    fixture.detectChanges();
    expect(component.searchForm.get('target').value).toBe('target');
  });

  it('should clear meeting points', () => {
    component.searchbar_meeting_points_origin = [1, 2, 3];
    fixture.detectChanges();
    expect(component.searchbar_meeting_points_origin.length).toBe(3);
    component.clear_meeting_points();
    fixture.detectChanges();
    expect(component.searchbar_meeting_points_origin.length).toBe(0);
  });

  it('should search meeting points for origin', () => {
    component.meeting_points = [
      {
        name: 'Plaza de españa',
      },
      {
        name: 'Viapol',
      },
      {
        name: 'Torre del oro',
      },
      {
        name: 'Estadio olímpico',
      },
    ];
    fixture.detectChanges();
    component.search_meeting_points_origin('Plaza de españa');
    fixture.detectChanges();
    expect(component.searchbar_meeting_points_origin[0].name).toBe(
      'Plaza de españa'
    );
  });

  it('should search meeting points for target', () => {
    component.meeting_points = [
      {
        name: 'Plaza de españa',
      },
      {
        name: 'Viapol',
      },
    ];
    fixture.detectChanges();
    component.search_meeting_points_target('Plaza de españa');
    fixture.detectChanges();
    expect(component.searchbar_meeting_points_target[0].name).toBe(
      'Plaza de españa'
    );
  });

  it('should not search meeting points for origin', () => {
    component.meeting_points = [
      {
        name: 'Plaza de españa',
      },
    ];
    fixture.detectChanges();
    component.search_meeting_points_origin(null);
    fixture.detectChanges();
    expect(component.searchbar_meeting_points_origin).toBeNull();
  });

  it('should not search meeting points for target', () => {
    component.meeting_points = [
      {
        name: 'Plaza de españa',
      },
    ];
    fixture.detectChanges();
    component.search_meeting_points_target(null);
    fixture.detectChanges();
    expect(component.searchbar_meeting_points_target).toBeNull();
  });

  it('should mark form as touched', async () => {
    component.searchForm.setValue({
      origin: 'Origen',
      target: 'Target',
      date: null,
      places: 3,
    });
    fixture.detectChanges();
    const spy = spyOn(component.searchForm, 'markAllAsTouched');
    expect(component.searchForm.valid).toBeFalsy();
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should redirect to result page', async () => {
    component.searchForm.setValue({
      origin: 'Origen',
      target: 'Target',
      date: 'fecha',
      places: 3,
    });
    fixture.detectChanges();
    expect(component.searchForm.valid).toBeTruthy();
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/', 'trip-search-result'],
        {
          queryParams: {
            origin: 'Origen',
            target: 'Target',
            date: 'fecha',
            places: 3,
          },
        }
      );
    });
  });
});
