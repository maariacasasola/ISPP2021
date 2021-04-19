import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TripsService } from 'apps/gotacar/src/app/services/trips.service';
import { Observable, of } from 'rxjs';
import { Trip } from '../../../shared/services/trip';
import { TripOrder } from '../../../shared/services/trip-order';
import { User } from '../../../shared/services/user';
import { AdminTripOrdersListPageComponent } from './admin-trip-orders-list-page.component';

describe('AdminTripOrdersListPageComponent', () => {
    let component: AdminTripOrdersListPageComponent;
    let fixture: ComponentFixture<AdminTripOrdersListPageComponent>;
    let tripsService: TripsService;
    let router: Router;
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    const location1 = {
        name: 'Sevilla',
        address: 'Calle Canal 48"',
        lat: 37.3747084,
        lng: -5.9649715,
    };

    const location2 = {
        name: 'Sevilla',
        address: 'Av. Diego Martínez Barrio',
        lat: 37.37625144174958,
        lng: -5.976345387146261,
    };

    const TRIP_OBJECT: Trip = {
        cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
        comments: '',
        end_date: new Date(2021, 6, 4, 13, 30, 24),
        start_date: new Date(2021, 6, 4, 13, 30, 24),
        ending_point: location2,
        starting_point: location1,
        places: 3,
        price: 200,
    }

    const USER_OBJECT: User = {
        id: "6072f5bfff1aa84599c35742",
        firstName: "Juan",
        lastName: "Perez",
        uid: "Ej7NpmWydRWMIg28mIypzsI4Bgm2",
        email: "client@gotacar.es",
        dni: "80808080R",
        profilePhoto: null,
        birthdate: new Date(2021, 6, 4, 13, 30, 24),
        roles: ["ROLE_CLIENT"],
        token: "Ej7NpmWydRWmIg28mIypzsI4BgM2",
        emailVerified: true,
        timesBanned: null,
    }

    const TRIP_ORDER_OBJECTS: TripOrder[] = [{
        trip: TRIP_OBJECT,
        user: USER_OBJECT,
        date: new Date(2021, 6, 4, 13, 30, 24),
        price: 300,
        paymentIntent: null,
        places: 2,
        status: "PROCCESSING",
    },
    {
        trip: TRIP_OBJECT,
        user: USER_OBJECT,
        date: new Date(2021, 6, 4, 13, 30, 24),
        price: 300,
        paymentIntent: null,
        places: 2,
        status: "PROCCESSING",
    }]

    class mockTripService {
        public get_all_trip_orders(): Observable<TripOrder[]> {
            return of(TRIP_ORDER_OBJECTS);
        }

    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminTripOrdersListPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [{ provide: TripsService, useClass: mockTripService },{ provide: Router, useValue: mockRouter }],
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

    it('should list trip orders', () => {
        spyOn(tripsService, 'get_all_trip_orders').and.returnValue(of(TRIP_ORDER_OBJECTS));
    })

    it('should navigate to trip order show', () => {
        expect(component.show_trip_order("607185d157102f6c17562b3b")).toBe(expect(router.navigate).toHaveBeenCalledWith(['admin', 'trip-orders', '607185d157102f6c17562b3b']));
    })
});