import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthServiceService } from '../../../services/auth-service.service';
import * as moment from 'moment';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'frontend-edit-profile-driver',
  templateUrl: './edit-profile-driver.component.html',
  styleUrls: ['./edit-profile-driver.component.scss'],
})
export class EditProfileDriverComponent implements OnInit {
  today = new Date();
  update_form = this.fb.group({
    firstName: ['', [Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    lastName: ['', [Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
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
    car_plate: ['', [Validators.required,Validators.pattern('^[0-9]{4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}')]],
    enrollment_date: ['', Validators.required],
    model: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
    color: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
  });

  user;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthServiceService,
    private _snackBar: MatSnackBar
  ) {
    this.load_user_data();
  }

  async load_user_data() {
    try {
      this.user = await this._authService.get_user_data();
      this.update_form.setValue({
        firstName: this.user?.firstName,
        lastName: this.user?.lastName,
        email: this.user?.email,
        dni: this.user?.dni,
        birthdate: this.user?.birthdate,
        phone: this.user?.phone,
        iban: this.user?.iban,
        car_plate: this.user?.carData?.carPlate || '',
        enrollment_date: this.user?.carData?.enrollmentDate || '',
        model: this.user?.carData?.model || '',
        color: this.user?.carData?.color || '',
      });
    } catch (error) {
      console.error(error);
      this.openSnackBar(
        'Ha ocurrido un error al recuperar tu perfil de usuario'
      );
    }
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.update_form.invalid) {
      this.update_form.markAllAsTouched();
      return;
    }

    if (!this.checkDate()) {
      this.openSnackBar('Debes ser mayor de 16');
      return;
    }

    try {
      const car_data = {
        carPlate: this.update_form.value.car_plate,
        enrollmentDate: moment(this.update_form.value.enrollment_date).format(
          'yyyy-MM-DD'
        ),
        model: this.update_form.value.model,
        color: this.update_form.value.color,
      };

      const user_data = {
        firstName: this.update_form.value.firstName,
        lastName: this.update_form.value.lastName,
        email: this.user.email,
        profilePhoto: this.user.profilePhoto,
        birthdate: moment(this.update_form.value.birthdate).format(
          'yyyy-MM-DD'
        ),
        dni: this.update_form.value.dni,
        phone: this.update_form.value.phone,
        iban: this.update_form.value.iban,
        carData: car_data,
      };

      const response = await this._authService.update_user_profile(user_data);

      if (response) {
        await this.load_user_data();
        this.openSnackBar('Perfil actualizado correctamente');
      }
    } catch (error) {
      console.error(error);
      this.openSnackBar(
        'Ha ocurrido un error al actualizar tu perfil de usuario'
      );
    }
  }

  checkDate() {
    const birthdate = moment(this.update_form.value.birthdate);
    const years = moment().diff(birthdate, 'years');
    return years > 16;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
