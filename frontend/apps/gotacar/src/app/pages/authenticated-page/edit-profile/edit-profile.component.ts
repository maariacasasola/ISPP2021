import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../../services/auth-service.service';

@Component({
  selector: 'frontend-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  update_form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dni: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')],
    ],
    birthdate: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern('^(?:6[0-9]|7[1-9])[0-9]{7}$')],
    ],
    iban: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}'
        ),
      ],
    ],
    driving_license: ['', Validators.required],
    car_plate: ['', Validators.required],
    enrollment_date: ['', Validators.required],
    model: ['', Validators.required],
    color: ['', Validators.required],
  });
  data;
  constructor(
    private fb: FormBuilder,
    private _authService: AuthServiceService,
    private _snackBar: MatSnackBar
  ) {
    const name = _authService
      .get_user_data()
      .then((data) => (this.data = data));
  }

  ngOnInit(): void {}
  onSubmit() {
    console.log(this.update_form.value);
    if (this.update_form.invalid) {
      this.update_form.markAllAsTouched();
      return;
    }
    if (!this.checkDate()) {
      this.openSnackBar('Debes ser mayor de edad');
      return;
    }
    try {
      //TODO con servicio
    } catch (error) {}
  }
  checkDate() {
    const date: Date = new Date(this.update_form.value.birthdate);
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
