import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageUploadDialogComponent } from '../../../components/image-upload-dialog/image-upload-dialog.component';
import { AuthServiceService } from '../../../services/auth-service.service';
import { UsersService } from '../../../services/users.service';
import * as moment from 'moment';
@Component({
  selector: 'frontend-client-become-driver-page',
  templateUrl: './client-become-driver-page.component.html',
  styleUrls: ['./client-become-driver-page.component.scss'],
})
export class ClientBecomeDriverPageComponent implements OnInit {
  driving_license;
  user_id;
  request_form = this.fb.group({
    iban: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}'
        ),
      ],
    ],
    experience: ['', [Validators.required,Validators.min(0), Validators.max(50),]],
    car_plate: [
      '',
      Validators.required,
      Validators.maxLength(8),
      Validators.minLength(7),
    ],
    enrollment_date: ['', Validators.required],
    model: ['', Validators.required],
    color: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
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
  }
  async load_user_data() {
    try {
      const user = await this._authService.get_user_data();
      this.user_id= user.id;
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

  async onSubmit() {
    //TODO Check enrollmentDate if should check PAST
    if (this.request_form.invalid) {
      this.request_form.markAllAsTouched();
      return;
    }
    try {
      const car_data = {
        carPlate: this.request_form.value.car_plate,
        enrollmentDate: moment(this.request_form.value.enrollment_date).format(
          'yyyy-MM-DD'
        ),
        model: this.request_form.value.model,
        color: this.request_form.value.color,
      };

      const user_data = {
        id:this.user_id,
        iban: this.request_form.value.iban,
        experience:this.request_form.value.experience,
        carData: car_data,
        driving_license:this.driving_license,
      };
      const response = await this._userService.request_conversion_to_driver(user_data);
      if (response) {
        this.openSnackBar('Convertido a conductor satisfactoriamente');
      }
    } catch (error) {
      this.openSnackBar(
        'Ha ocurrido un error al intentar convertirte en conductor'
      );
    }
  }
}
