import { Pipe, PipeTransform } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';

@Pipe({
  name: 'tripOrderType',
})
export class TripOrderTypePipe implements PipeTransform {
  transform(value: any[], ...args: any): unknown {
    if (!(value instanceof Array)) {
      return [];
    }
    let trip_order = [...value];
    const filter = args[0];
    if (filter.type) {
      if (filter.type === 'pending') {
        trip_order = trip_order.filter(
          (t) => new Date(t?.trip?.startDate) >= new Date()
        );
      } else if (filter.type === 'completed') {
        trip_order = trip_order.filter(
          (t) => new Date(t?.trip?.startDate) < new Date()
        );
      }
    }
    return trip_order;
  }
}
