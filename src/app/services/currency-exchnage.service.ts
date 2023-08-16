import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchnageService {
  apiKey: string = '2007c25940cbd3bd11dab11c2244fd47';
  baseUrl: string = 'http://data.fixer.io/api/';

  exchangeDataSubject = new BehaviorSubject({});
  currencyConfigSubject = new BehaviorSubject({});
  getSelectedDetailsPage = new BehaviorSubject({})

  constructor(private http: HttpClient) {}

  getAllCurrencies() {
    return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}`);
  }

  getEURToUSD() {
    return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}&symbols=USD`);
  }

  getMostPopularCurrencies() {
    return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}&symbols=USD,AUD,CAD,PLN,MXN,JPY,GBP,EGP,KWD`);
  }

  // getFullNameCurrencies() {
  //   return this.http.get(`https://data.fixer.io/api/symbols?access_key=${this.apiKey}`);
  // }



}
