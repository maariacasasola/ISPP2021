import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'frontend-create-trip-driver',
  templateUrl: './create-trip-driver.component.html',
  styleUrls: ['./create-trip-driver.component.scss']
})
export class CreateTripDriverComponent {

  createTripForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    fecha: ['', Validators.required],
    comentarios: ['', Validators.required],
    price: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }


  onSubmit(){
    console.log(this.createTripForm.value);
  }

}
