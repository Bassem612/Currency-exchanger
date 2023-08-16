import { Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private currencyExchnageService: CurrencyExchnageService){

  }


  ngOnInit() {
    
  }

  

}
