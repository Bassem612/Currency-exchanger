import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchnageService {
  constructor(private http: HttpClient) {}

  apiKey: string = '2007c25940cbd3bd11dab11c2244fd47';
  baseUrl: string = 'http://data.fixer.io/api/';
  exchangeDataSubject = new BehaviorSubject({});

  getAllCurrencies() {
   return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}`)
    .pipe(map((res:any) => {
     return Object.entries(res.rates);
    }));
  }

  getMostPopularCurrencies() {
    return this.http.get(`${this.baseUrl}latest?access_key=${this.apiKey}&symbols=USD,AUD,CAD,PLN,MXN,JPY,GBP,EGP,KWD`)
    .pipe(map((res:any) => {
      return Object.entries(res.rates);
     }));
  }
}
