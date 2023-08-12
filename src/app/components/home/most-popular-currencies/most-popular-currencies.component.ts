import { Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';

@Component({
  selector: 'app-most-popular-currencies',
  templateUrl: './most-popular-currencies.component.html',
  styleUrls: ['./most-popular-currencies.component.scss']
})
export class MostPopularCurrenciesComponent implements OnInit {

  exchnageDataObject!: {base: string, amount: number, unit: number};
  ratesArray!: any; 

  constructor(private currencyExchnageService: CurrencyExchnageService){}

  ngOnInit() {
    this.getMostPopularCurrencies();
    this.getExchangeData();
  }


  getMostPopularCurrencies() {
    this.currencyExchnageService.getMostPopularCurrencies().subscribe((res: any) => {
      console.log(res);
      this.ratesArray = Object.entries(res.rates);
      console.log(this.ratesArray);
  });
  }

  getExchangeData() {
    this.currencyExchnageService.exchangeDataSubject.subscribe((res: any) => {
      this.exchnageDataObject = res;
      console.log(this.exchnageDataObject);
      
    });
  }

}
