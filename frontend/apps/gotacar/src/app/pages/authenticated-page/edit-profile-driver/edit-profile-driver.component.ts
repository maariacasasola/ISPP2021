import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthServiceService } from '../../../services/auth-service.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ValidatorService } from 'angular-iban';

@Component({
  selector: 'frontend-edit-profile-driver',
  templateUrl: './edit-profile-driver.component.html',
  styleUrls: ['./edit-profile-driver.component.scss'],
})
export class EditProfileDriverComponent {
  today = new Date();
  update_form = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
    dni: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')],
    ],
    birthdate: [{ value: '', disabled: true }, Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern('^(?:6[0-9]|7[1-9])[0-9]{7}$')],
    ],
    iban: [
      '',
      [
        Validators.required,
        ValidatorService.validateIban
      ],
    ],
    car_plate: ['', [Validators.required, Validators.pattern('^[0-9]{4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}')]],
    enrollment_date: ['', Validators.required],
    model: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    color: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
  });

  user;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private _authService: AuthServiceService,
    public _snackBar: MatSnackBar
  ) {
    this.load_user_data();
  }

  async load_user_data() {
    try {
      this.user = await this._authService.get_user_data();
      this.update_form.setValue({
        firstName: this.user?.firstName || '',
        lastName: this.user?.lastName || '',
        email: this.user?.email || '',
        password: '',
        dni: this.user?.dni || '',
        birthdate: this.user?.birthdate || '',
        phone: this.user?.phone || '',
        iban: this.user?.iban || '',
        car_plate: this.user?.carData?.carPlate || '',
        enrollment_date: this.user?.carData?.enrollmentDate || '',
        model: this.user?.carData?.model || '',
        color: this.user?.carData?.color || '',
      });
    } catch (error) {
      this.openSnackBar(
        'Ha ocurrido un error al recuperar tu perfil de usuario'
      );
    }
  }

  async onSubmit() {
    if (this.update_form.invalid) {
      this.update_form.markAllAsTouched();
      return;
    }

    if (!this.checkEnrollmentDateBeforeBirthDate()) {
      this.openSnackBar('La fecha de obtención de tu carné no puede ser anterior a tu nacimiento y debías ser mayor de edad');
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
        email: this.update_form.value.email,
        profilePhoto: this.user.profilePhoto,
        birthdate: this.user.birthdate,
        dni: this.user.dni,
        phone: this.update_form.value.phone,
        iban: this.update_form.value.iban,
        carData: car_data,
      };
      if (this.user.email !== this.update_form.value.email) {
        await this._authService.update_email(this.update_form.value.email);
      }
      if (this.update_form.value.password !== '') {
        await this._authService.update_password(this.update_form.value.password);
      }

      const response = await this._authService.update_user_profile(user_data);

      if (response) {
        await this.load_user_data();
        this.openSnackBar('Perfil actualizado correctamente');
        this._authService.sign_out();
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
  checkEnrollmentDateBeforeBirthDate() {
    const birthdate = moment(this.user.birthdate);
    const enrollment = moment(this.update_form.value.enrollment_date);
    const years = enrollment.diff(birthdate, 'years')
    return enrollment > birthdate && years > 16;
  }


  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
