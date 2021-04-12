import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-admin-trip-orders-list-page',
  templateUrl: './admin-trip-orders-list-page.component.html',
  styleUrls: ['./admin-trip-orders-list-page.component.scss'],
})
export class AdminTripOrdersListPageComponent {
  tripOrders = [];

  constructor(private _trips_service: TripsService, public router: Router) {
    this.load_trip_orders();
  }

  async load_trip_orders() {
    try {
      this.tripOrders = await this._trips_service.get_all_trip_orders();
    } catch (error) {
      console.error(error);
    }
  }

  translate_status(status) {
    switch (status) {
      case "PROCCESSING": return "PROCESANDO PAGO";
      case "REFUNDED_PENDING": return "REINTEGRO PENDIENTE";
      case "REFUNDED": return "REINTEGRO REALIZADO";
      case "PAID": return "PAGO REALIZADO";
      case "OTHER": return "OTRO";
    }
  }

  show_trip_order(trip_order_id: string) {
    this.router.navigate(['admin', 'trip-orders', trip_order_id])
  }
}
