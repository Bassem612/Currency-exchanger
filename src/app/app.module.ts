import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule,} from '@angular/common/http';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CurrencyExchangerComponent } from './components/home/currency-exchanger/currency-exchanger.component';
import { MostPopularCurrenciesComponent } from './components/home/most-popular-currencies/most-popular-currencies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsComponent } from './components/details/details.component';
import { AppRoutingModule } from './app-routing.module';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    CurrencyExchangerComponent,
    MostPopularCurrenciesComponent,
    DetailsComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
