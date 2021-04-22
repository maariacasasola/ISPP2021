import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TripDetailsPageComponent } from './trip-details-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from '../../services/trips.service';
import { Observable, of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'apps/gotacar/src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { ConvertCentToEurPipe } from '../../pipes/convert-cent-to-eur.pipe';
import { CurrencyPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceService } from '../../services/auth-service.service';
import { UsersService } from '../../services/users.service';

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

const USER_OBJECT = {
    id: '1',
    firstName: 'Manuel',
    lastName: 'Fernandez',
    uid: '1',
    email: 'manan@gmail.com',
    dni: '312312312',
    profilePhoto: 'http://dasdasdas.com',
    birthdate: new Date(1994, 6, 4, 13, 30, 24),
    roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
    emailVerified: true,
    timesBanned: 2,
    token: '12312ed2',
};

const USER_OBJECT2 = {
    id: '2',
    firstName: 'Manuel',
    lastName: 'Fernandez',
    uid: '2',
    email: 'manan@gmail.com',
    dni: '312312312',
    profilePhoto: 'http://dasdasdas.com',
    birthdate: new Date(1994, 6, 4, 13, 30, 24),
    roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
    emailVerified: true,
    timesBanned: 2,
    token: '12312ed2',
};

const TRIP_OBJECT = {
    cancelationDateLimit: new Date(2021, 6, 4, 13, 30, 24),
    comments: '',
    end_date: new Date(2021, 6, 4, 13, 30, 24),
    startDate: new Date(2021, 6, 4, 13, 30, 24),
    endingPoint: location2,
    startingPoint: location1,
    places: 3,
    price: 200,
    canceled: false,
    driver: USER_OBJECT,
};

const RATING_OBJECT = {
    id: '1',
    from: USER_OBJECT2,
    to: USER_OBJECT,
    content: '',
    points: 4,
    trip: TRIP_OBJECT,
    createdAt: new Date(),
}

class mockUsersService {
    public rate_user() {
        return of(RATING_OBJECT);
    }

}

class mockTripService {
    public get_trip() {
        return of(TRIP_OBJECT);
    }

    public create_stripe_session() {
        return of();
    }
}

class mockAuthService {
    public is_client(): Observable<Boolean> {
        return of(true);
    }

    public user_is_banned(): Observable<Boolean> {
        return of(false);
    }
}

class mockDialog {
    open() {
        return {
            afterClosed: () => of({})
        };
    }
}

describe('TripDetailsPageComponent', () => {
    let component: TripDetailsPageComponent;
    let fixture: ComponentFixture<TripDetailsPageComponent>;
    let authService: AuthServiceService;
    let dialog: any;
    let userService: UsersService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MatSnackBarModule,
                HttpClientTestingModule,
                MatTooltipModule,
                BrowserAnimationsModule,
                AngularFireModule.initializeApp(environment.firebaseConfig),
            ],
            declarations: [TripDetailsPageComponent, ConvertCentToEurPipe],
            providers: [CurrencyPipe,
                { provide: AuthServiceService, useClass: mockAuthService },
                { provide: UsersService, useClass: mockUsersService },
                { provide: TripsService, useClass: mockTripService },
                { provide: MatDialog, useClass: mockDialog },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripDetailsPageComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthServiceService);
        userService = TestBed.inject(UsersService);
        dialog = TestBed.inject(MatDialog);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get profile photo of generic user', () => {
        expect(component.get_profile_photo()).toBe(
            'assets/img/generic-user.jpg'
        );
    });

    it('should get profile photo of user', () => {
        component.trip.driver = USER_OBJECT;
        expect(component.get_profile_photo()).toBe(
            component.trip.driver.profilePhoto
        );
    });

    it('should get trip description', () => {
        component.trip = TRIP_OBJECT;
        expect(component.get_trip_description()).toBe(
            'Viaje desde ' +
            component.trip.startingPoint.address +
            ' hasta ' +
            component.trip.endingPoint.address
        );
    });

    it('should show rating', (async () => {
        const spy_open_dialog = spyOn(dialog, 'open').and.callThrough();
        component.openDialogRating(TRIP_OBJECT.driver.id);
        fixture.detectChanges();
        expect(spy_open_dialog).toBeCalledTimes(1);
    }));

    it('should show driver data', (async () => {
        const spy_open_dialog = spyOn(dialog, 'open').and.callThrough();
        component.open_driver_data_dialog(TRIP_OBJECT);
        fixture.detectChanges();
        expect(spy_open_dialog).toBeCalledTimes(1);
    }));

    it('should order trip', (async () => {
        const spy_is_client = spyOn(authService, 'is_client').and.returnValue(true);
        const spy_open_dialog = spyOn(dialog, 'open').and.callThrough();
        component.order_trip();
        fixture.detectChanges();
        expect(spy_is_client).toBeCalledTimes(1);
        expect(spy_open_dialog).toBeCalledTimes(1);
    }));

    it('should not order trip not client', (async () => {
        const spy_is_client = spyOn(authService, 'is_client').and.returnValue(false);
        const spy_open_dialog = spyOn(dialog, 'open').and.callThrough();
        component.order_trip();
        fixture.detectChanges();
        expect(spy_is_client).toBeCalledTimes(1);
        expect(spy_open_dialog).toBeCalledTimes(0);
    }));

    it('should show buy button', () => {
        component.trip = TRIP_OBJECT;
        component.user = USER_OBJECT2;
        expect(component.show_buy_button()).toBe(TRIP_OBJECT.places > 0 && new Date(TRIP_OBJECT.startDate) > new Date()
            && TRIP_OBJECT.canceled !== true && USER_OBJECT2.uid !== TRIP_OBJECT.driver.uid);
        fixture.detectChanges();
    });

});
