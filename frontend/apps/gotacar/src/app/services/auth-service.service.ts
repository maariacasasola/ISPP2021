import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import auth from 'firebase/app';
import { MatDialog } from '@angular/material/dialog';
import { ComplaintAppealDialogComponent } from '../components/complaint-appeal-dialog/complaint-appeal-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComplaintAppealsService } from './complaint-appeals.service';
import { ComplaintsService } from './complaints.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  userData: any;
  complaint;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private _http_client: HttpClient,
    private _complaint_appeals_service: ComplaintAppealsService,
    private _snackbar: MatSnackBar,
    private _complaint_service: ComplaintsService,
    private dialog: MatDialog
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  sign_in(email, password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.set_user_data(result.user);
      })
      .catch((error) => {
        this.handle_firebase_auth_error(error);
      });
  }

  sign_up(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async register(user) {
    return this._http_client
      .post(environment.api_url + '/user/register', user)
      .toPromise();
  }

  is_logged_in(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }

  is_admin(): boolean {
    let has_admin_role = false;
    if (localStorage.getItem('roles')) {
      has_admin_role = localStorage.getItem('roles').includes('ROLE_ADMIN');
    }
    return this.is_logged_in() && has_admin_role;
  }

  is_client(): boolean {
    let has_client_role = false;
    if (localStorage.getItem('roles')) {
      has_client_role = localStorage.getItem('roles').includes('ROLE_CLIENT');
    }
    return this.is_logged_in() && has_client_role;
  }

  is_driver(): boolean {
    let has_driver_role = false;
    if (localStorage.getItem('roles')) {
      has_driver_role = localStorage.getItem('roles').includes('ROLE_DRIVER');
    }
    return this.is_client() && has_driver_role;
  }

  user_is_banned(): boolean {
    return new Date(localStorage.getItem('bannedUntil')) > new Date();
  }

  async get_user_data(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/current_user')
      .toPromise();
  }

  google_auth() {
    return this.auth_login(new auth.auth.GoogleAuthProvider());
  }

  navigate_google_register(result) {
    this.ngZone.run(() => {
      this.router.navigate(['/', 'google-register'], {
        queryParams: {
          uid: result.user.uid,
          email: result.user.email,
        },
      });
    });
  }

  auth_login(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        if (result.additionalUserInfo.isNewUser) {
          this.navigate_google_register(result)
        } else {
          try {
            await this.set_user_data(result.user);
            this.ngZone.run(() => {
              this.router.navigate(['home']);
            });
          } catch (error) {
            localStorage.removeItem('user');
            this.navigate_google_register(result)
          }
        }
      })
      .catch((error) => {
        this.handle_firebase_auth_error(error);
      });
  }

  async set_banned(uid) {
    let { bannedUntil } = await this.get_token(uid);
    localStorage.setItem('bannedUntil', bannedUntil);
  }

  async set_user_data(user) {
    let { token, roles, bannedUntil } = await this.get_token(user.uid);
    token = token.replace('Bearer ', '');
    localStorage.setItem('token', token);
    localStorage.setItem('roles', roles);
    localStorage.setItem('uid', user.uid);
    if (!bannedUntil) return;
    localStorage.setItem('bannedUntil', bannedUntil);
    this.can_appeal();
  }

  async can_appeal() {
    let canAppeal = await this._complaint_appeals_service.can_complaint_appeal();
    if (canAppeal) {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        this.complaint = await this._complaint_service.get_complaint_for_user_banned(user.uid);
      } catch (error) {
        console.error(error);
      }
      this.dialog.open(ComplaintAppealDialogComponent, { data: { complaint: this.complaint } });
    } else {
      this._snackbar.open('La cuenta está baneada ', null, {
        duration: 3000,
      });
    }
  }

  get_token(user_uid): Promise<any> {
    return this._http_client
      .post(environment.api_url + '/user', null, {
        params: {
          uid: user_uid,
        },
      })
      .toPromise();
  }

  sign_out() {
    localStorage.removeItem('token');
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('bannedUntil');
      localStorage.removeItem('roles');
      this.router.navigate(['log-in']);
    });
  }

  get_user() {
    return JSON.parse(localStorage.getItem('user'));
  }

  async update_user_profile(data) {
    return this._http_client
      .post(environment.api_url + '/user/update', data)
      .toPromise();
  }

  delete_account() {
    this.afAuth.currentUser.then((u) =>
      u.delete().then(() => {
        this.router.navigate(['home']);
      })
    );
  }

  handle_firebase_auth_error(error) {
    switch (error.code) {
      case 'auth/wrong-password':
        this._snackbar.open('Contraseña incorrecta', null, {
          duration: 3000,
        });
        return;
      case 'auth/invalid-email':
        this._snackbar.open('Introduce tu email correctamente', null, {
          duration: 3000,
        });
        return;
      case 'auth/user-not-found':
        this._snackbar.open(
          'No hay ningún usuario registrado con este email',
          null,
          {
            duration: 3000,
          }
        );
        return;
      default:
        this._snackbar.open('Ha ocurrido un error al iniciar tu sesión', null, {
          duration: 3000,
        });
        return;
    }
  }
}
