import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../services/auth-service.service';

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
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  onSubmit() {
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
      const email = this.register_form.value.email;
      const password = this.register_form.value.password;
      //const uid = this._authService.sign_up(email, password);
    } catch (error) {}
    //authService.sign_in(userName.value, userPassword.value)
  }

  checkDate() {
    const date: Date = new Date(this.register_form.value.birthdate);
    let timeDiff = Math.abs(Date.now() - date.getTime());
    let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age > 17;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
