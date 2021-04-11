import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderTrips',
})
export class OrderTripsPipe implements PipeTransform {
  transform(value: any[], ...args: any): unknown {
    let trips = [...value];
    const filter = args[0];

    // Filtramos por precios
    if (filter.min_price !== 0) {
      trips = trips.filter((t) => t.price >= filter.min_price);
    }

    if (filter.max_price !== 10000) {
      trips = trips.filter((t) => t.price <= filter.max_price);
    }

    // Ordenamos
    if (filter.order_by) {
      switch (filter.order_by) {
        case 'price_asc':
          trips = trips.sort((a, b) => {
            if (a.price > b.price) {
              return 1;
            }
            if (a.price < b.price) {
              return -1;
            }
            return 0;
          });
          break;
        case 'price_desc':
          trips = trips.sort((a, b) => {
            if (a.price > b.price) {
              return -1;
            }
            if (a.price < b.price) {
              return 1;
            }
            return 0;
          });
          break;
        case 'date_asc':
          trips = trips.sort((a, b) => {
            if (a.startDate > b.startDate) {
              return 1;
            }
            if (a.startDate < b.startDate) {
              return -1;
            }
            return 0;
          });
          break;
        case 'date_desc':
          console.log('has');
          trips = trips.sort((a, b) => {
            if (a.startDate > b.startDate) {
              return -1;
            }
            if (a.startDate < b.startDate) {
              return 1;
            }
            return 0;
          });
          break;
      }
    }
    return trips;
  }
}
