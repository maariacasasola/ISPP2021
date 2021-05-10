import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { TripMapComponent } from './trip-map.component';

describe('TripMapComponent', () => {
    let component: TripMapComponent;
    let fixture: ComponentFixture<TripMapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TripMapComponent, MapMarker],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [{ provide: GoogleMap, useValue: { load: jasmine.createSpy('load') } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        fixture.detectChanges();
    });
});