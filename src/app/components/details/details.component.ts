import { Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(private currencyExchnageService: CurrencyExchnageService) {}


  ngOnInit() {

  }
}
