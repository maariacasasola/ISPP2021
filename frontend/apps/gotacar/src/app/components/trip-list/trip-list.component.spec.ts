import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TripListComponent } from './trip-list.component';

const USER_OBJECT = {
  profilePhoto: 'http://dasdasdas.com',
  birthdate: new Date(1997, 6, 10, 12, 30, 18),
};

const TRIP_OBJECT = {
  id: 1,
  driver: USER_OBJECT,
};

const TRIP_OBJECT1 = {
  id: 1,
  driver: {},
};

describe('TripListComponent', () => {
  let component: TripListComponent;
  let fixture: ComponentFixture<TripListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule
      ],
      declarations: [TripListComponent],
      providers: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should get profile photo of generic user', () => {
    expect(component.get_profile_photo(TRIP_OBJECT1)).toBe(
      'assets/img/default-user.jpg'
    );
  });

  it('should get profile photo of user', () => {
    component.trips = [TRIP_OBJECT];
    expect(component.get_profile_photo(TRIP_OBJECT)).toBe(
      component.trips[0].driver.profilePhoto
    );
  });

  it('should redirect to trip details', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.see_trip_details(TRIP_OBJECT.id);
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'trip', TRIP_OBJECT.id]);
  });
});
