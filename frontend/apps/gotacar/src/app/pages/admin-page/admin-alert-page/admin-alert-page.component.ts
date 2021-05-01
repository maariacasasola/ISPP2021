import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'frontend-admin-alert-page',
  templateUrl: './admin-alert-page.component.html',
  styleUrls: ['./admin-alert-page.component.scss'],
})
export class AdminAlertPageComponent implements OnInit {
  form: FormGroup;
  email: string;
  message: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(256),
  ]);
  honeypot: FormControl = new FormControl(''); // we will use this to prevent spam
  submitted: boolean = false; // show and hide the success message
  isLoading: boolean = false; // disable the submit button if we're loading
  responseMessage: string; // the response message to show to the user
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private route:ActivatedRoute) {

    this.form = this.formBuilder.group({
      message: this.message,
      email: this.email,
      honeypot: this.honeypot,
    });
    
  }
  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('user_email');
  }

  onSubmit() {
    console.log("email: " + this.email)
    if (this.form.status == 'VALID' && this.honeypot.value == '') {
      this.form.disable(); // disable the form if it's valid to disable multiple submissions
      var formData: any = new FormData();
      formData.append('email', this.email);
      formData.append('message', this.form.get('message').value);
      this.isLoading = true; // sending the post request async so it's in progress
      this.submitted = false; // hide the response message on multiple submits
      this.http
        .post(
          'https://script.google.com/macros/s/AKfycbz7EwoK-15OdeQrSrMtDTkPKixhpkHtlon5Yhxle08GcUm41v16/exec',
          formData
        )
        .subscribe(
          (response) => {
            // choose the response message
            if (response['result'] == 'success') {
              this.responseMessage =
                'El mensaje de alerta ha sido enviado satisfactoriamente.';
            } else {
              this.responseMessage =
                'Oops! Algo ha ido mal... ¿Podrías refrescar la página o voler a intentarlo más tarde?.';
            }
            this.form.enable(); // re enable the form after a success
            this.submitted = true; // show the response message
            this.isLoading = false; // re enable the submit button
          },
          (error) => {
            this.responseMessage =
              'Oops! Ha habido un error... ¿Podrías refrescar la página o voler a intentarlo más tarde?.';
            this.form.enable(); // re enable the form after a success
            this.submitted = true; // show the response message
            this.isLoading = false; // re enable the submit button
          }
        );
    }
  }
}
