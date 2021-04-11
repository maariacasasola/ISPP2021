import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { convert_cent_to_eur } from '../shared/utils/functions';

@Pipe({
  name: 'convertCentToEur',
  pure: true,
})
export class ConvertCentToEurPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}
  transform(value): string {
    const euro_amount = convert_cent_to_eur(value || 0);
    return this.currencyPipe.transform(euro_amount, 'EUR');
  }
}
