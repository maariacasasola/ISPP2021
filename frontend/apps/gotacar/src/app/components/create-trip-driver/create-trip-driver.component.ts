import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'frontend-create-trip-driver',
  templateUrl: './create-trip-driver.component.html',
  styleUrls: ['./create-trip-driver.component.scss']
})
export class CreateTripDriverComponent {

  minDate: Date;

  createTripForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    fecha: ['', Validators.required],
    numeroPasajero: ['', Validators.required],
    comentarios: ['', Validators.required],
    price: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.minDate = new Date();
  }


  onSubmit() {
    console.log(this.createTripForm.value);
    this.hourIsValid()
    this.checkOrigen()
  }

  checkOrigen() {
    const origen = this.createTripForm.value.origen;
    const destino = this.createTripForm.value.destino;

    const isValid = origen == destino;

    if (isValid) {
      this.openSnackBar(
        'El origen y el destino no pueden ser el mismo',
        'Cerrar'
      );
    }

  }

  hourIsValid() {

    const horaInicio = this.createTripForm.value.horaInicio.trim().toLowerCase();
    const horaFin = this.createTripForm.value.horaFin.trim().toLowerCase();

    const isValid = horaInicio < horaFin;

    if (!isValid) {
      this.openSnackBar(
        'La hora de inicio no puede ser posterior a la hora de fin del viaje',
        'Cerrar'
      );
    }

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }


}
