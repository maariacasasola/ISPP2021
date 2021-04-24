import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'frontend-client-contact-page',
  templateUrl: './client-contact-page.component.html',
  styleUrls: ['./client-contact-page.component.scss'],
})
export class ClientContactPageComponent implements OnInit {
  form: FormGroup;
  name: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$')]);
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  message: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(256),
  ]);
  honeypot: FormControl = new FormControl(''); // we will use this to prevent spam
  submitted: boolean = false; // show and hide the success message
  isLoading: boolean = false; // disable the submit button if we're loading
  responseMessage: string; // the response message to show to the user
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      message: this.message,
      honeypot: this.honeypot,
    });
  }
  ngOnInit(): void {}

  onSubmit() {
    if (this.form.status == 'VALID' && this.honeypot.value == '') {
      this.form.disable(); // disable the form if it's valid to disable multiple submissions
      var formData: any = new FormData();
      formData.append('name', this.form.get('name').value);
      formData.append('email', this.form.get('email').value);
      formData.append('message', this.form.get('message').value);
      this.isLoading = true; // sending the post request async so it's in progress
      this.submitted = false; // hide the response message on multiple submits
      this.http
        .post(
          'https://script.google.com/macros/s/AKfycbwwr5N0tI0DxqCZqflFDt4kXfOxdo0npQW7Lq6z2FbDeauMRds/exec',
          formData
        )
        .subscribe(
          (response) => {
            // choose the response message
            if (response['result'] == 'success') {
              this.responseMessage =
                'Gracias por ponerte en contacto con el equipo de soporte de GotACar. Contactaremos contigo con la mayor brevedad posible.';
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
