import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../../services/auth-service.service';
import * as moment from 'moment';

@Component({
  selector: 'frontend-edit-profile-client',
  templateUrl: './edit-profile-client.component.html',
  styleUrls: ['./edit-profile-client.component.scss'],
})
export class EditProfileClientComponent {
  update_form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
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
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        dni: this.user.dni,
        birthdate: this.user.birthdate,
        phone: this.user.phone,
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

    if (!this.checkDate()) {
      this.openSnackBar('Debes ser mayor de edad');
      return;
    }

    try {
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
      };
      const response = await this._authService.update_user_profile(user_data);
      if (response) {
        await this.load_user_data();
        this.openSnackBar('Perfil actualizado correctamente');
      }
    } catch (error) {
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
