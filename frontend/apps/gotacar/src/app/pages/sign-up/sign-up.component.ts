import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../services/auth-service.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'frontend-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  today = new Date();
  accepted = false;
  register_form = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        ),
      ],
    ],
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
    private _router: Router
  ) { }

  checked(event: MatCheckboxChange): void {
    this.accepted = event.checked;
  }

  async onSubmit() {
    if (this.register_form.invalid) {
      this.register_form.markAllAsTouched();
      return;
    }
    if (!this.checkDate()) {
      this.openSnackBar('Debes ser mayor de edad para poder registrarte');
      return;
    }
    const { email, password } = this.register_form.value;
    this.register_user(email, password);
  }

  async register_user(email, password) {
    await this._authService
      .sign_up(email, password)
      .then(async (response) => {
        if (response.user.uid) {
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
            uid: response.user.uid,
            email: email,
            dni: dni,
            birthdate: moment(birthdate).format('yyyy-MM-DD'),
            phone: phone,
          };
          const register_response = await this._authService.register(user);
          if (register_response) {
            this.openSnackBar(
              '¡Bienvenido a GotACar! Inicie sesión con su nueva cuenta'
            );
            await this._router.navigate(['/', 'log-in']);
          }
        }
      })
      .catch((error) => {
        if (error.message === 'The email address is badly formatted.') {
          this.openSnackBar('El email no es válido');
        } else {
          this.openSnackBar('Ha ocurrido un error, inténtelo más tarde');
        }

      });
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
