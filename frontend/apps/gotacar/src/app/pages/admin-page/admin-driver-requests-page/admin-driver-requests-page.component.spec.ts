import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../shared/services/user';
import { AdminDriverRequestsPageComponent } from './admin-driver-requests-page.component';

describe('AdminDriverRequestsPageComponent', () => {
    let component: AdminDriverRequestsPageComponent;
    let fixture: ComponentFixture<AdminDriverRequestsPageComponent>;
    let usersService: UsersService;

    const DRIVER_OBJECT: User = {
        id: "6072f5bfff1aa84899c35742",
        firstName: "Juan",
        lastName: "Perez",
        uid: "Ej7NpmWydRWMIg28mIypzsI4Bgm2",
        email: "client@gotacar.es",
        dni: "80808080R",
        profilePhoto: null,
        birthdate: new Date(2021, 6, 4, 13, 30, 24),
        roles: ["ROLE_CLIENT", "ROLE_DRIVER"],
        token: "Ej7NpmWydRWmIg28mIypzsI4BgM2",
        emailVerified: true,
        timesBanned: null,
    }

    const USER_OBJECT: User = {
        id: "6072f5bfff1aa84899c35742",
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

    const USER_OBJECTS: User[] = [
        {
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
        },]

    class mockUsersService {
        public get_all_driver_requests(): Observable<User[]> {
            return of(USER_OBJECTS);
        }

        public convert_to_driver(USER_OBJECT): Observable<User> {
            return of(DRIVER_OBJECT);
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminDriverRequestsPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, MatSnackBarModule],
            providers: [{ provide: UsersService, useClass: mockUsersService },],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDriverRequestsPageComponent);
        component = fixture.componentInstance;
        usersService = TestBed.inject(UsersService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list requests', () => {
        component.load_driver_requests();
        spyOn(usersService, 'get_all_driver_requests').and.returnValue(of(USER_OBJECTS));
    });

    it('#accept_request() should accept request', () => {

    });
});