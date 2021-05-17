
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from 'apps/gotacar/src/app/services/users.service';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/services/user';
import { AdminUserListPageComponent } from './admin-user-list-page.component';

const USER_OBJECT = {
    id: "6072f5bfff1aa84599c35742",
    firstName: "Juan",
    lastName: "Perez",
    uid: "Ej7NpmWydRWMIg28mIypzsI4Bgm2",
    email: "client@gotacar.es",
    dni: "80808080R",
    birthdate: new Date(2021, 6, 4, 13, 30, 24),
    roles: ["ROLE_CLIENT"],
    token: "Ej7NpmWydRWmIg28mIypzsI4BgM2",
    emailVerified: true,
    timesBanned: 3,
}

const USER_OBJECTS = [
    {id: "6072f5bfff1aa84599c35742",
    firstName: "Juan",
    lastName: "Perez",
    uid: "Ej7NpmWydRWMIg28mIypzsI4Bgm2",
    email: "client@gotacar.es",
    dni: "80808080R",
    profilePhoto: "http://dadada.com",
    birthdate: new Date(2021, 6, 4, 13, 30, 24),
    roles: ["ROLE_CLIENT"],
    token: "Ej7NpmWydRWmIg28mIypzsI4BgM2",
    emailVerified: true,
    timesBanned: 3,},
]

class mockUsersService {
    public delete_penalized_account() {
        return of(USER_OBJECT);
    }
    public get_all_users() {
        return of(USER_OBJECTS);
    }
}

describe('AdminUserListPageComponent', () => {
    let component: AdminUserListPageComponent;
    let fixture: ComponentFixture<AdminUserListPageComponent>;
    let usersService: UsersService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminUserListPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, MatSnackBarModule, CommonModule],
            providers: [{ provide: UsersService, useClass: mockUsersService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminUserListPageComponent);
        component = fixture.componentInstance;
        usersService = TestBed.inject(UsersService);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        // fixture.detectChanges();
    });

    it('should list users', () => {
        spyOn(usersService, 'get_all_users').and.returnValue(of(USER_OBJECTS));
    });

    it('should delete user', () => {
        component.delete_account("607185d157102f6c17562b3b");
        expect(component.users).not.toContain(USER_OBJECT);
    });

    it('should get profile photo of generic user', () => {
        expect(component.get_profile_photo(USER_OBJECT)).toBe(
            'assets/img/default-user.jpg'
        );
    });
    
    it('should get profile photo of user', () => {
        expect(component.get_profile_photo(USER_OBJECTS[0])).toBe(
            USER_OBJECTS[0].profilePhoto
        );
    });

    it('should redirect to user ratings', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.go_to_user_ratings(USER_OBJECT.id);
        // fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'admin', 'user-ratings', USER_OBJECT.id]);
    });

    it('should redirect to alert user ', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.go_to_alert_user(USER_OBJECT.email);
        // fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['admin', 'alert', USER_OBJECT.email]);
    });
})