import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdminTripListPageComponent } from './admin-trip-list-page.component';
import { of } from 'rxjs';
import { TripsService } from '../../../services/trips.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConvertCentToEurPipe } from '../../../pipes/convert-cent-to-eur.pipe';
import { CurrencyPipe } from '@angular/common';

const TRIP_OBJECT = {
  startDate: new Date(2021, 6, 20),
};

class mockTripsService{
  public get_all_trips(){
    return of([TRIP_OBJECT,]) || [];
  };
};

describe('AdminTripListPageComponent', () => {
  let component: AdminTripListPageComponent;
  let fixture: ComponentFixture<AdminTripListPageComponent>;
  let tripService: TripsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        ],
      declarations: [AdminTripListPageComponent, ConvertCentToEurPipe, CurrencyPipe,],
      providers: [CurrencyPipe,{provide: TripsService, useClass: mockTripsService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTripListPageComponent);
    component = fixture.componentInstance;
    tripService=TestBed.inject(TripsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.trips=[TRIP_OBJECT,];
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });  

  it('should get start date', () => {
    component.trips=[TRIP_OBJECT,];
    const spy=spyOn(component, 'getStartDate');
    component.getStartDate(TRIP_OBJECT);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should throw error while loading trips',()=>{
    component.trips=[TRIP_OBJECT,];
    const spy = spyOn(component._snackbar, 'open');
    spyOn(tripService, 'get_all_trips').and.throwError('error');
    component.load_trips();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith("Se ha producido un error al cargar los viajes", null, {
        duration: 5000});
    });
  });
});
