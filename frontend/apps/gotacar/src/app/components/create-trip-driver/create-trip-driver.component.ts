import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';


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

  constructor(private fb: FormBuilder) { 
    this.minDate = new Date();
  }


  onSubmit(){
    console.log(this.createTripForm.value);
    this.hourIsValid()
  }

  hourIsValid():void{
    const fechaHoraInicial = new Date()
    fechaHoraInicial.setDate(this.createTripForm.value.fecha)
    fechaHoraInicial.setTime(this.createTripForm.value.horaInicio)
    const fechaHoraFinal = this.createTripForm.value.fecha + this.createTripForm.value.horaFin
    console.log(fechaHoraInicial)
    console.log(fechaHoraFinal)


    
  }

}
