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
  honeypot: FormControl = new FormControl('');
  submitted: boolean = false;
  isLoading: boolean = false;
  responseMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
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
    if (this.form.status == 'VALID' && this.honeypot.value == '') {
      this.form.disable();
      var formData: any = new FormData();
      formData.append('email', this.email);
      formData.append('message', this.form.get('message').value);
      this.isLoading = true;
      this.submitted = false;
      this.http
        .post(
          'https://script.google.com/macros/s/AKfycbz7EwoK-15OdeQrSrMtDTkPKixhpkHtlon5Yhxle08GcUm41v16/exec',
          formData
        )
        .subscribe(
          (response) => {
            if (response['result'] == 'success') {
              this.responseMessage =
                'El mensaje de alerta ha sido enviado satisfactoriamente.';
            } else {
              this.responseMessage =
                'Oops! Algo ha ido mal... ¿Podrías refrescar la página o voler a intentarlo más tarde?.';
            }
            this.form.enable();
            this.submitted = true;
            this.isLoading = false;
          },
          (error) => {
            this.responseMessage =
              'Oops! Ha habido un error... ¿Podrías refrescar la página o voler a intentarlo más tarde?.';
            this.form.enable();
            this.submitted = true;
            this.isLoading = false;
          }
        );
    }
  }
}
