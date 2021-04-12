
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from 'apps/gotacar/src/app/services/users.service';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/services/user';
import { AdminUserListPageComponent } from './admin-user-list-page.component';

describe('AdminUserListPageComponent', () => {
    let component: AdminUserListPageComponent;
    let fixture: ComponentFixture<AdminUserListPageComponent>;
    let usersService: UsersService;

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
        timesBanned: 3,
    }

    const USER_OBJECTS: User[] = [
        USER_OBJECT,
    ]

    class mockUsersService {
        public delete_penalized_account(): Observable<User> {
            return of(USER_OBJECT);
        }
        public get_all_users(): Observable<User[]> {
            return of(USER_OBJECTS);
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminUserListPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, MatSnackBarModule],
            providers: [{ provide: UsersService, useClass: mockUsersService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminUserListPageComponent);
        component = fixture.componentInstance;
        usersService = TestBed.inject(UsersService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list trip orders', () => {
        spyOn(usersService, 'get_all_users').and.returnValue(of(USER_OBJECTS));
    });

    it('should delete user', () => {
        component.delete_account("607185d157102f6c17562b3b");
        expect(component.users).not.toContain(USER_OBJECT);
    });
})