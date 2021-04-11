import { CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConvertCentToEurPipe } from 'apps/gotacar/src/app/pipes/convert-cent-to-eur.pipe';
import { TripsService } from 'apps/gotacar/src/app/services/trips.service';
import { Trip } from 'apps/gotacar/src/app/shared/services/trip';
import { TripOrder } from 'apps/gotacar/src/app/shared/services/trip-order';
import { User } from 'apps/gotacar/src/app/shared/services/user';
import { Observable, of } from 'rxjs';
import { AdminTripOrderDetailsPageComponent } from './admin-trip-order-details-page.component';

describe('AdminTripOrderDetailsPageComponent', () => {
    let component: AdminTripOrderDetailsPageComponent;
    let fixture: ComponentFixture<AdminTripOrderDetailsPageComponent>;
    let tripsService: TripsService;

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
        id: "1",
        firstName: "Juan",
        lastName: "Perez",
        uid: "se2",
        email: "cl@gotacar.es",
        dni: "80808080R",
        profilePhoto: null,
        birthdate: new Date(2021, 6, 4, 13, 30, 24),
        roles: ["ROLE_CLIENT"],
        token: "er2",
        emailVerified: true,
    }

    const TRIP_ORDER_OBJECT: TripOrder={
        trip: TRIP_OBJECT,
        user: USER_OBJECT,
        date: new Date(2021, 6, 4, 13, 30, 24),
        price: 300,
        paymentIntent:null,
        places:2,
        status:"PROCCESSING",
    }

    class mockTripService {
        public get_trip_order(): Observable<TripOrder> {
            return of(TRIP_ORDER_OBJECT);
        }
    }

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [AdminTripOrderDetailsPageComponent, ConvertCentToEurPipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [CurrencyPipe,{ provide: TripsService, useClass: mockTripService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminTripOrderDetailsPageComponent);
        component = fixture.componentInstance;
        tripsService = TestBed.inject(TripsService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should translate status', () => {
        expect(component.translateStatus("PROCCESSING")).toContain("PROCESANDO PAGO");
        expect(component.translateStatus("REFUNDED_PENDING")).toContain("REINTEGRO PENDIENTE");
        expect(component.translateStatus("REFUNDED")).toContain("REINTEGRO REALIZADO");
        expect(component.translateStatus("PAID")).toContain("PAGO REALIZADO");
        expect(component.translateStatus("OTHER")).toContain("OTRO");
    });

    it('should return trip order information', () => {
        spyOn(tripsService, 'get_trip_order').and.returnValue(of(TRIP_ORDER_OBJECT));
    });
});