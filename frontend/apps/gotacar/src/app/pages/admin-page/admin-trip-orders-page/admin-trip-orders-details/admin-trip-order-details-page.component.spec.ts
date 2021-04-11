import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from 'apps/gotacar/src/app/app.module';
import { ConvertCentToEurPipe } from 'apps/gotacar/src/app/pipes/convert-cent-to-eur.pipe';
import { TripsService } from 'apps/gotacar/src/app/services/trips.service';
import { AdminTripOrderDetailsPageComponent } from './admin-trip-order-details-page.component';

describe('AdminTripOrderDetailsPageComponent', () => {
    let component: AdminTripOrderDetailsPageComponent;
    let fixture: ComponentFixture<AdminTripOrderDetailsPageComponent>;
    let tripsService: TripsService;
    let mockService = {get_trip_order:jasmine.createSpy('get_trip_order')};
    mockService.get_trip_order.and.returnValue((
        [{trip_order:{id: "607185d157102f6c17562b3b",
        trip: {
            id: "607185d157102f6c17562b36",
            startingPoint: {
                lng: -5.9938026174584484,
                lat: 37.38094298983268,
                address: "Paseo de Roma, 33, 41013 Sevilla",
                name: "Puerta Jerez"
            },
            endingPoint: {
                lng: -5.987332644990308,
                lat: 37.34260576245235,
                address: "Av. de Palmas Altas, 1, 41012 Sevilla",
                name: "Lagoh"
            },
            price: 350,
            startDate: "2021-03-20T17:00:00",
            endingDate: "2021-03-20T17:21:00",
            cancelationDate: null,
            cancelationDateLimit: "2021-03-20T16:00:00",
            comments: "Viaje desde Puerta Jerez hasta Lagoh",
            places: 2,
            canceled: false,
            driver: {
                id: "607185d157102f6c17562b1f",
                firstName: "Jesús",
                lastName: "Márquez",
                uid: "h9HmVQqlBQXD289O8t8q7aN2Gzg1",
                email: "driver@gotacar.es",
                dni: "89070310K",
                profilePhoto: null,
                birthdate: "2001-12-30",
                roles: [
                    "ROLE_CLIENT",
                    "ROLE_DRIVER"
                ],
                bannedUntil: null,
                driver_status: null,
                phone: null,
                iban: null,
                times_banned: null,
                driving_license: null,
                experience: null,
                carData: null
            },
            tripOrders: null
        },
        user: {
            id: "607185d157102f6c17562b22",
            firstName: "Martín",
            lastName: "Romero",
            uid: "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1",
            email: "client@gotacar.es",
            dni: "89070336D",
            profilePhoto: "http://dniclient.com",
            birthdate: "2001-12-30",
            roles: [
                "ROLE_CLIENT"
            ],
            bannedUntil: null,
            driver_status: null,
            phone: null,
            iban: null,
            times_banned: null,
            driving_license: null,
            experience: null,
            carData: null
        },
        date: "2021-03-20T11:45:00",
        price: 350,
        paymentIntent: "",
        places: 1,
        status: "PROCCESSING"}}]
    ));
    mockService.get_trip_order.and.throwError("Http failure response for http://localhost:8081/trip_order/show/6072d367a7fe0020d337a97io: 404 OK")

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminTripOrderDetailsPageComponent,ConvertCentToEurPipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule,AppModule],
            providers: [{ provide: TripsService, useValue: mockService },{provide: APP_BASE_HREF, useValue: '/'}],
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

    it('should translate status', ()=>{
        expect(component.translateStatus("PROCCESSING")).toContain("PROCESANDO PAGO");
        expect(component.translateStatus("REFUNDED_PENDING")).toContain("REINTEGRO PENDIENTE");
        expect(component.translateStatus("REFUNDED")).toContain("REINTEGRO REALIZADO");
        expect(component.translateStatus("PAID")).toContain("PAGO REALIZADO");
        expect(component.translateStatus("OTHER")).toContain("OTRO");
    })
});