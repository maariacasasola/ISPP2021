import { CurrencyPipe } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { ConvertCentToEurPipe } from './convert-cent-to-eur.pipe';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [CurrencyPipe],
  });
});

it('create an instance', inject(
  [CurrencyPipe],
  (currencyPipe: CurrencyPipe) => {
    const pipe = new ConvertCentToEurPipe(currencyPipe);
    expect(pipe).toBeTruthy();
  }
));

it('should be 22.22', inject([CurrencyPipe], (currencyPipe: CurrencyPipe) => {
  const pipe = new ConvertCentToEurPipe(currencyPipe);
  const newnumber = pipe.transform(100);
  expect(newnumber).toBe('€1.00');
}));
