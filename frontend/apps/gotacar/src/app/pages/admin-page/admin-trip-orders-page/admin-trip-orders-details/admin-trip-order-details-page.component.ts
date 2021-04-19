import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from '../../..//../services/trips.service';

@Component({
  selector: 'frontend-admin-trip-order-details-page',
  templateUrl: './admin-trip-order-details-page.component.html',
  styleUrls: ['./admin-trip-order-details-page.component.scss'],
})
export class AdminTripOrderDetailsPageComponent {
  page_title = 'Detalles del contrato de viaje';
  trip_order;

  constructor(
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
  ) {
    this.load_trip_order();
  }

  private get_trip_order_id(): string {
    return this._route.snapshot.params['trip_order_id'];
  }

  private async load_trip_order() {
    try {
      this.trip_order = await this._trip_service.get_trip_order(this.get_trip_order_id());
    } catch (error) {
      console.error(error);
    }
  }

  translateStatus(status) {
    switch (status) {
      case "PROCCESSING": return "PROCESANDO PAGO";
      case "REFUNDED_PENDING": return "REINTEGRO PENDIENTE";
      case "REFUNDED": return "REINTEGRO REALIZADO";
      case "PAID": return "PAGO REALIZADO";
      case "OTHER": return "OTRO";
    }
  }
}
