import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import auth from 'firebase/app';
import { MatDialog } from '@angular/material/dialog';
import { ComplaintAppealDialogComponent } from '../components/complaint-appeal-dialog/complaint-appeal-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private _http_client: HttpClient,
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
        this.set_user_data(result.user).then(() => {
          this.is_banned();
        });
      })
      .catch((error) => {
        window.alert(error.message);
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

  async send_verification_mail() {
    return this.afAuth.currentUser.then((u) =>
      u.sendEmailVerification().then(() => {
        this.router.navigate(['verify-email-address']);
      })
    );
  }

  forgot_password(passwordResetEmail) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
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

  is_banned() {
    let bool = false;
    this.get_user_data().then((result) => {
      bool = result.bannedUntil !== null;
      if (bool) {
        const t = this.dialog.open(ComplaintAppealDialogComponent, {
          disableClose: true,
        });
        t.afterClosed().subscribe(() => this.sign_out());
      }
    });
  }

  async get_user_data(): Promise<any> {
    return await this._http_client
      .get(environment.api_url + '/current_user')
      .toPromise();
  }

  google_auth() {
    return this.auth_login(new auth.auth.GoogleAuthProvider());
  }

  auth_login(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        if (result.additionalUserInfo.isNewUser) {
          this.ngZone.run(() => {
            this.router.navigate(['/', 'google-register'], {
              queryParams: {
                uid: result.user.uid,
                email: result.user.email,
              },
            });
          });
        } else {
          try {
            await this.set_user_data(result.user);
            this.ngZone.run(() => {
              this.router.navigate(['home']);
            });
          } catch (error) {
            localStorage.removeItem('user');
            this.ngZone.run(() => {
              this.router.navigate(['/', 'google-register'], {
                queryParams: {
                  uid: result.user.uid,
                  email: result.user.email,
                },
              });
            });
          }
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  async set_user_data(user) {
    let { token, roles } = await this.get_token(user.uid);
    token = token.replace('Bearer ', '');
    localStorage.setItem('token', token);
    localStorage.setItem('roles', roles);
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
}
