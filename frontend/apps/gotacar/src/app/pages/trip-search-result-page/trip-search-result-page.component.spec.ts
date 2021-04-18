import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import { of } from 'rxjs';
import { OrderTripsPipe } from '../../pipes/order-trips.pipe';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { MeetingPointService } from '../../services/meeting-point.service';
import { TripSearchResultPageComponent } from './trip-search-result-page.component';

class mockMeetingPointService {
  get_all_meeting_points() {
    return [];
  }
}

class mockGeocoderService {
  get_location_from_address() {
    return { results: [] };
  }
}

describe('TripSearchResultPageComponent', () => {
  let component: TripSearchResultPageComponent;
  let fixture: ComponentFixture<TripSearchResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [TripSearchResultPageComponent, OrderTripsPipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: of([
                {
                  places: 1,
                  date: new Date(),
                  origin: 'Calle canal',
                  target: 'Avenida reina mercedes',
                },
              ]),
            },
          },
        },
        { provide: MeetingPointService, useClass: mockMeetingPointService },
        { provide: GeocoderServiceService, useClass: mockGeocoderService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSearchResultPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open snackbar when searching locations out of Sevilla', async () => {
    const spy_snackbar = spyOn(component, 'openSnackBar');
    fixture.detectChanges();
    await component.load_search_params();
    fixture.whenStable().then(() => {
      expect(spy_snackbar).toHaveBeenCalledWith(
        'Solo trabajamos con localizaciones de Sevilla'
      );
    });
  });

  it('shoud check if trip is in hour', () => {
    const startDate = moment().add(1, 'minute');
    expect(component.tipIsInHour(startDate)).toBeFalsy();
  });

  it('should change order_by', () => {
    component.order_by_changed('price_asc');
    fixture.detectChanges();
    expect(component.filter.order_by).toBe('price_asc');
  });

  it('should change_filter_min_price', () => {
    component.change_filter_min_price(10);
    fixture.detectChanges();
    expect(component.filter.min_price).toBe(10);
  });

  it('should change_filter_max_price', () => {
    component.change_filter_max_price(10);
    fixture.detectChanges();
    expect(component.filter.max_price).toBe(10);
  });

  it('should set filters', () => {
    component.trips = [
      {
        price: 10,
      },
      {
        price: 30,
      },
      {
        price: 50,
      },
      {
        price: 100,
      },
    ];
    component.set_filters();
    fixture.detectChanges();
    expect(component.price_range_options.translate(10)).toBe('0.1 €');
    expect(component.price_range_options.floor).toBe(0);
    expect(component.price_range_options.ceil).toBe(100);
  });
});
