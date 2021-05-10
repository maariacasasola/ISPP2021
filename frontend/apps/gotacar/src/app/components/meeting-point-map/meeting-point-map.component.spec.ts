import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MeetingPointMapComponent } from './meeting-point-map.component';

describe('MeetingPointMapComponent', () => {
  let component: MeetingPointMapComponent;
  let fixture: ComponentFixture<MeetingPointMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingPointMapComponent, MapMarker],
      schemas: [NO_ERRORS_SCHEMA],
      imports:[],
      providers: [{ provide: GoogleMap, useValue: { load: jasmine.createSpy('load') }}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPointMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should update marker', () => {
    component.location={
      lat: 35,
      lng:35,
      name: 'Sevilla',
      address: 'Sevilla'
    };
    
    let new_point={
      position: {
        lat: +component.location?.lat,
        lng: +component.location?.lng,
      },
      title: component.location?.name,
      info: component.location?.address,
    };
    component.center=new_point.position;

    component.update_marker();
    fixture.detectChanges();
  });

  it('should detect changes', () => {
    const spy=spyOn(component, 'update_marker');
    let prev_value = 'old';
    let new_value = 'new';
    let is_first_change: boolean = false;

    component.ngOnChanges({
      prop1: new SimpleChange(prev_value, new_value, is_first_change),
    })
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
