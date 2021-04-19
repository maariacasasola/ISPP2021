import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageUploadDialogComponent } from '../../../components/image-upload-dialog/image-upload-dialog.component';
import { AuthServiceService } from '../../../services/auth-service.service';
import { UsersService } from '../../../services/users.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'frontend-client-become-driver-page',
  templateUrl: './client-become-driver-page.component.html',
  styleUrls: ['./client-become-driver-page.component.scss'],
})
export class ClientBecomeDriverPageComponent implements OnInit {
  today: Date = new Date();
  birth_date;
  driving_license;
  user_id;
  request_form = this.fb.group({
    iban: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '([a-zA-Z]{2}\\d{2})(\\d{4})(\\d{4})(\\d{2})(\\d{10})'
        ),
      ],
    ],
    experience: [
      '',
      [Validators.required, Validators.min(0), Validators.max(50)],
    ],
    car_plate: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]{4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}'),
      ],
    ],
    enrollment_date: ['', Validators.required],
    model: ['', [Validators.required]],
    color: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')],
    ],
  });
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private _authService: AuthServiceService,
    private _userService: UsersService,
    private _my_dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.load_user_data();
  }

  ngOnInit(): void {}
  async obtain_driving_license() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
      user_id: this.user_id,
      is_become_driver: true,
    };

    const dialogRef = this._my_dialog.open(
      ImageUploadDialogComponent,
      dialogConfig
    );

    const dialog_response = await dialogRef.afterClosed().toPromise();
    this.driving_license = dialog_response;
  }
  async load_user_data() {
    try {
      const user = await this._authService.get_user_data();
      this.birth_date = user.birthdate;
      this.user_id = user.id;
    } catch (error) {
      this.openSnackBar(
        'Ha ocurrido un error al recuperar el identificador de usuario'
      );
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
  checkExperienciaWithEnrollment(): boolean {
    const enrollment_date = moment(this.request_form.value.enrollment_date);
    const years = moment().diff(enrollment_date, 'years');
    const exp = this.request_form.value.experience;
    return years >= exp;
  }
  checkEnrollmentDateBeforeBirthDate() {
    const birthdate = moment(this.birth_date);
    const enrollment = moment(this.request_form.value.enrollment_date);
    const years = enrollment.diff(birthdate, 'years');
    return enrollment > birthdate && years > 16;
  }
  async onSubmit() {
    if (this.request_form.invalid) {
      this.request_form.markAllAsTouched();
      return;
    }
    if (!this.checkEnrollmentDateBeforeBirthDate()) {
      this.openSnackBar(
        'La fecha de obtención de tu carné no puede ser anterior a tu nacimiento y debías ser mayor de edad'
      );
      return;
    }
    if (!this.checkExperienciaWithEnrollment()) {
      this.openSnackBar(
        'La fecha de obtención de tu carné no corresponde con tu experiencia'
      );
      return;
    }
    if (!this.driving_license) {
      this.openSnackBar('Debe proporcionar una imagen de su licencia');
      return;
    }
    try {
      const car_data = {
        car_plate: this.request_form.value.car_plate,
        enrollment_date: moment(this.request_form.value.enrollment_date).format(
          'yyyy-MM-DD'
        ),
        model: this.request_form.value.model,
        color: this.request_form.value.color,
      };

      const user_data = {
        id: this.user_id,
        iban: this.request_form.value.iban,
        experience: Number(this.request_form.value.experience),
        car_data: car_data,
        driving_license: this.driving_license,
      };
      const response = await this._userService.request_conversion_to_driver(
        user_data
      );
      if (response) {
        this.openSnackBar('Petición de conversión realizada correctamente');
        this.router.navigate(['authenticated/profile']);
      }
    } catch (error) {
      this.openSnackBar(
        'Ha ocurrido un error al intentar convertirte en conductor'
      );
    }
  }
}
