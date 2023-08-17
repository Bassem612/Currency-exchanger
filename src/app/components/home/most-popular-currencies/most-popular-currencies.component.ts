import { Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';

@Component({
  selector: 'app-most-popular-currencies',
  templateUrl: './most-popular-currencies.component.html',
  styleUrls: ['./most-popular-currencies.component.scss']
})
export class MostPopularCurrenciesComponent implements OnInit {

  exchnageDataObject!: { base: string, amount: number, unit: number };
  ratesArray!: [string, number][];
  allCurrencies!: [string, number][];
  symbolValue!: number;
  baseValue!: number;
  loader: boolean = false;

  constructor(private currencyExchnageService: CurrencyExchnageService) { }

  ngOnInit() {
    this.getMostPopularCurrencies();
    this.getExchangeData();
    this.getAllCurrencies();
  }

  private getMostPopularCurrencies() {
    this.currencyExchnageService.getMostPopularCurrencies().subscribe((res: any) => {
      this.ratesArray = res;
    });
  }

  private getExchangeData() {
    this.currencyExchnageService.exchangeDataSubject.subscribe((res: any) => {
      this.exchnageDataObject = res;
    });
  }

  private getAllCurrencies() {
    this.loader = true;
    this.currencyExchnageService.getAllCurrencies().subscribe((res: any) => {
      this.loader = false;
      this.allCurrencies = res
    });
  }

  getcurrentRateValue(baseKey: string, symbolKey: string) {
    if (baseKey) {
      this.baseValue = this.allCurrencies.filter(array => {
        return array[0] === baseKey;
      })[0][1];
    } else {
      this.baseValue = this.allCurrencies.filter(array => {
        return array[0] === 'EUR';
      })[0][1];
    }

    if (symbolKey) {
      this.symbolValue = this.ratesArray.filter(array => {
        return array[0] === symbolKey;
      })[0][1];
    } else {
      this.symbolValue = this.ratesArray.filter(array => {
        return array[0] === 'USD';
      })[0][1];
    }

    return this.symbolValue / this.baseValue;
  }
}


