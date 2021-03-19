import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { FormValidations } from '../../utils/form-validations'

@Component({
  selector: 'frontend-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {

  searchForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    fecha: ['', [Validators.required, FormValidations.isActualDate]],
    //numPasajeros: ['', Validators.required],
  });

  origenLocation: Location;
  destinoLocation: Location;

  constructor(private fb: FormBuilder, private geocodeService: GeocoderServiceService) { }


  async onSubmit() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    console.warn(this.searchForm.value);
    const coordinatesOrigin = await this.get_origin();
    const coordinatesTarget = await this.get_target();
  
    console.log(coordinatesOrigin);
    console.log(coordinatesTarget);
    
  }

  async get_origin() {
    try {
      const { results } = await this.geocodeService.get_location_from_address(this.searchForm.value.origen);
      const coordinates = {
        lat: results[0]?.geometry?.location?.lat,
        lng: results[0]?.geometry?.location?.lng,
      }
      return coordinates;

    } catch (error) {
      console.error(error);
    }
  }

  async get_target() {
    try {
      const { results } = await this.geocodeService.get_location_from_address(this.searchForm.value.destino);
      const coordinates = {
        lat: results[0]?.geometry?.location?.lat,
        lng: results[0]?.geometry?.location?.lng,
      }
      return coordinates;
    } catch (error) {
      console.error(error);
    }
  }

}