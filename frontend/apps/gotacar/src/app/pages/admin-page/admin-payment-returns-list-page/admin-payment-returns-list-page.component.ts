import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentReturnsService } from '../../../services/payment-returns.service';

@Component({
  selector: 'frontend-admin-payment-returns-list-page',
  templateUrl: './admin-payment-returns-list-page.component.html',
  styleUrls: ['./admin-payment-returns-list-page.component.scss'],
})
export class AdminPaymentReturnsListPageComponent {
  payment_returns;

  constructor(
    private _payment_returns_service: PaymentReturnsService,
    private _snackbar: MatSnackBar
  ) {
    this.load_payment_returns();
  }

  async load_payment_returns() {
    try {
      this.payment_returns = await this._payment_returns_service.get_all_payment_returns();
    } catch (error) {
      this.show_message('Ha ocurrido un error, inténtelo más tarde');
    }
  }

  show_message(message) {
    this._snackbar.open(message, null, {
      duration: 3000,
    });
  }
}
