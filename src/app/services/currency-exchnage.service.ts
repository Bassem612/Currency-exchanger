import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchnageService {
  apiKey: string = '2007c25940cbd3bd11dab11c2244fd47';
  baseUrl: string = 'http://data.fixer.io/api/';
  // exchangeData: {} = {
  //   base: "EUR",

  // }
  exchangeDataSubject = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  getEURToUSD() {
    return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}&symbols=USD`);
  }

  getMostPopularCurrencies() {
    return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}&symbols=USD,AUD,CAD,PLN,MXN,JPY,GBP,EGP,KWD`);
  }

}
