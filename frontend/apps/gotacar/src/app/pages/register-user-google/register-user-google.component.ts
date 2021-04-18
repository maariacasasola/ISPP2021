import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../services/auth-service.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'frontend-register-user-google',
  templateUrl: './register-user-google.component.html',
  styleUrls: ['./register-user-google.component.scss'],
})
export class RegisterUserGoogleComponent implements OnInit {
  firebase_uid;
  firebase_email;

  register_form = this.fb.group({
    firstName: ['', [Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    lastName: ['', [Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    dni: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')],
    ],
    birthdate: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern('^(?:6[0-9]|7[1-9])[0-9]{7}$')],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private _authService: AuthServiceService,
    private _snackBar: MatSnackBar,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.firebase_email = this._route.snapshot.queryParams['email'];
    this.firebase_uid = this._route.snapshot.queryParams['uid'];
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.register_form.invalid) {
      this.register_form.markAllAsTouched();
      return;
    }

    if (!this.checkDate()) {
      this.openSnackBar('Debes ser mayor de edad para poder registrarte');
      return;
    }

    try {
      const {
        firstName,
        lastName,
        birthdate,
        dni,
        phone,
      } = this.register_form.value;
      const user = {
        firstName: firstName,
        lastName: lastName,
        uid: this.firebase_uid,
        email: this.firebase_email,
        dni: dni,
        birthdate: moment(birthdate).format('yyyy-MM-DD'),
        phone: phone,
      };
      const register_response = await this._authService.register(user);
      if (register_response) {
        this.openSnackBar('¡Bienvenido a GotACar! Inicie sesión con su nueva cuenta')
        await this._router.navigate(['/', 'log-in']);
      }
    } catch (error) {
      console.error(error);
      this.openSnackBar('Ha ocurrido un error, inténtelo más tarde');
    }
  }

  checkDate() {
    const birthdate = moment(this.register_form.value.birthdate);
    const years = moment().diff(birthdate, 'years');
    return years > 16;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
