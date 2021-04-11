import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from 'apps/gotacar/src/app/app.module';
import { TripsService } from 'apps/gotacar/src/app/services/trips.service';
import { AdminTripOrdersListPageComponent } from './admin-trip-orders-list-page.component';

describe('AdminTripOrdersListPageComponent', () => {
    let component: AdminTripOrdersListPageComponent;
    let fixture: ComponentFixture<AdminTripOrdersListPageComponent>;
    let tripsService: TripsService;
    let router: Router;
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminTripOrdersListPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, AppModule],
            providers: [{ provide: TripsService }, { provide: APP_BASE_HREF, useValue: '/' }, { provide: Router, useValue: mockRouter }],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(AdminTripOrdersListPageComponent);
        component = fixture.componentInstance;
        tripsService = TestBed.inject(TripsService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should translate status', () => {
        expect(component.translate_status("PROCCESSING")).toContain("PROCESANDO PAGO");
        expect(component.translate_status("REFUNDED_PENDING")).toContain("REINTEGRO PENDIENTE");
        expect(component.translate_status("REFUNDED")).toContain("REINTEGRO REALIZADO");
        expect(component.translate_status("PAID")).toContain("PAGO REALIZADO");
        expect(component.translate_status("OTHER")).toContain("OTRO");
    })

    it('should show trip order', () => {

        expect(component.show_trip_order("607185d157102f6c17562b3b")).toBe(expect(router.navigate).toHaveBeenCalledWith(['admin','trip-orders','607185d157102f6c17562b3b']));
    })
});