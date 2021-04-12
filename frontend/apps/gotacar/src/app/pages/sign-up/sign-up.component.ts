import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../services/auth-service.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  register_form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
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
  ) {}

  ngOnInit(): void {}

  async onSubmit() {
    console.log(this.register_form.value);
    if (this.register_form.invalid) {
      this.register_form.markAllAsTouched();
      return;
    }
    if (!this.checkDate()) {
      this.openSnackBar('Debes ser mayor de edad para poder registrarte');
      return;
    }
    try {
      const { email, password } = this.register_form.value;
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
            await this._router.navigate(['/', 'log-in']);
          }
        })
        .catch((error) => {
          console.error(error);
          this.openSnackBar('Ha ocurrido un error, inténtelo más tarde');
        });
    } catch (error) {
      console.error(error);
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