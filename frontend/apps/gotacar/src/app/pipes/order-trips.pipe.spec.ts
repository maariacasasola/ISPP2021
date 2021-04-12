import { OrderTripsPipe } from './order-trips.pipe';
var moment = require('moment');

describe('OrderTripsPipe', () => {
  const trips = [
    {
      price: 200,
      startDate: moment().add(10, 'm').toDate(),
    },
    {
      price: 120,
      startDate: moment().add(20, 'm').toDate(),
    },
    {
      price: 140,
      startDate: moment().add(30, 'm').toDate(),
    },
    {
      price: 100,
      startDate: moment().add(40, 'm').toDate(),
    },
    {
      price: 60,
      startDate: moment().add(50, 'm').toDate(),
    },
    {
      price: 70,
      startDate: moment().add(1, 'h').toDate(),
    },
    {
      price: 80,
      startDate: moment().add(2, 'm').toDate(),
    },
    {
      price: 20,
      startDate: moment().add(3, 'm').toDate(),
    },
    {
      price: 10,
      startDate: moment().add(4, 'm').toDate(),
    },
  ];

  it('should order by price asc and filter', () => {
    const pipe = new OrderTripsPipe();

    const result = pipe.transform(trips, {
      order_by: 'price_asc',
      max_price: 100,
      min_price: 50,
    });

    expect(result[0]).toBe(trips[4]);
  });

  it('should order by price desc and filter', () => {
    const pipe = new OrderTripsPipe();

    const result = pipe.transform(trips, {
      order_by: 'price_desc',
      max_price: 100,
      min_price: 50,
    });

    expect(result[0]).toBe(trips[3]);
  });

  it('should order by date desc and filter', () => {
    const pipe = new OrderTripsPipe();

    const result = pipe.transform(trips, {
      order_by: 'date_desc',
      max_price: 10000,
      min_price: 0,
    });

    expect(result[0]).toBe(trips[5]);
  });

  it('should order by date asc and filter', () => {
    const pipe = new OrderTripsPipe();

    const result = pipe.transform(trips, {
      order_by: 'date_asc',
      max_price: 10000,
      min_price: 0,
    });

    expect(result[0]).toBe(trips[6]);
  });
});
