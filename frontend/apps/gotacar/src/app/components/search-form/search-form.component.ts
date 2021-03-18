import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'frontend-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  searchForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    fecha: ['', Validators.required],
    //numPasajeros: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void { }

  onSubmit() {
    console.warn(this.searchForm.value)
  }

}