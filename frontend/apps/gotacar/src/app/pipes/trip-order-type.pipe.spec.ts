import { TripOrderTypePipe } from './trip-order-type.pipe';
var moment = require('moment');

describe('TripOrderTypePipe', () => {
  const trip_orders = [{
    trip: {
      startDate: "2021-08-20T17:00:00",
    },
  },
  {
    trip: {
      startDate: "2021-03-20T17:00:00",
    },
  }];

  it('should show pending trip orders', () => {
    const pipe = new TripOrderTypePipe();

    const result = pipe.transform(trip_orders, {
      type: 'pending',
    });

    expect(result[0]).toBe(trip_orders[0]);
  });

  it('should show completed trip orders', () => {
    const pipe = new TripOrderTypePipe();

    const result = pipe.transform(trip_orders, {
      type: 'completed',
    });

    expect(result[0]).toBe(trip_orders[1]);
  });

  it('should show all trip orders', () => {
    const pipe = new TripOrderTypePipe();

    const result = pipe.transform(trip_orders, {
      type: 'all',
    });

    expect(result).toStrictEqual(trip_orders);
  });
});
