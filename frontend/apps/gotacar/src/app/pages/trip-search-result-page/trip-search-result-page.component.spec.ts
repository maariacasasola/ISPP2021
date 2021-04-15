import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { TripSearchResultPageComponent } from './trip-search-result-page.component';


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
            declarations: [SignUpComponent],

            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });


    beforeEach(() => {
        fixture = TestBed.createComponent(TripSearchResultPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load search params', () => {
        spyOn(component, 'load_search_params');
        component.load_search_params();
        fixture.detectChanges();
        expect(component.load_search_params).toHaveBeenCalled();
    });

    it('should get search results', () => {
        spyOn(component, 'get_search_results');
        component.get_search_results();
        fixture.detectChanges();
        expect(component.get_search_results).toHaveBeenCalled();
    });

    it('should open snackbar', () => {
        spyOn(component, 'openSnackBar');
        component.openSnackBar('a,b,c', 'Cerrar');
        fixture.detectChanges();
        expect(component.openSnackBar).toHaveBeenCalled();
    });

    it('should get right coordinates', () => {
        spyOn(component, 'get_coordinates');
        component.get_coordinates('Nervion');
        fixture.detectChanges();
        expect(component.get_coordinates).toHaveBeenCalled();
    });

    it('should filter by limit date', () => {

        component.tipIsInHour('2021-04-15T20:00:00');
        fixture.detectChanges();
        const result = component;
        fixture.detectChanges();

        expect(result).toBeTruthy();
    });

    it('should order by value', () => {

        component.order_by_changed(2);
        fixture.detectChanges();
        const result = component;
        fixture.detectChanges();

        expect(result).toBeTruthy();
    });

    it('should filter by min price', () => {

        component.change_filter_min_price(2);
        fixture.detectChanges();
        const result = component;
        fixture.detectChanges();

        expect(result).toBeTruthy();
    });

    it('should filter by max price', () => {

        component.change_filter_max_price(2);
        fixture.detectChanges();
        const result = component;
        fixture.detectChanges();

        expect(result).toBeTruthy();
    });
    
});
