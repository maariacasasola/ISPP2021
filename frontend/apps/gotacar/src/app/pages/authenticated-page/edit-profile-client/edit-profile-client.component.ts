import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../../services/auth-service.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-edit-profile-client',
  templateUrl: './edit-profile-client.component.html',
  styleUrls: ['./edit-profile-client.component.scss'],
})
export class EditProfileClientComponent {
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
  });

  user;

  constructor(
    private fb: FormBuilder,
    public router: Router,
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
        password: '',
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

    try {
      const user_data = {
        firstName: this.update_form.value.firstName,
        lastName: this.update_form.value.lastName,
        email: this.update_form.value.email,
        profilePhoto: this.user.profilePhoto,
        birthdate: this.user.birthdate,
        dni: this.user.dni,
        phone: this.update_form.value.phone,
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
      this.openSnackBar(
        'Ha ocurrido un error al actualizar tu perfil de usuario'
      );
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
