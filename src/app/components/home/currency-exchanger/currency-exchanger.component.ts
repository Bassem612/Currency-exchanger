import {AfterContentInit, Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss']
})
export class CurrencyExchangerComponent implements OnInit, AfterContentInit {

  //UI
  allCurrencies!: [string, number][];
  currentAmount!: number;
  baseName!: string;
  symbolName!: string;
  baseValue!: number;
  symbolValue!: number;
  oneUnitValue!: number;
  costantEURTOUSDRatio!: number;
  conversionResult!: number;
  currentRoute!: string
  selectedCurrenciesDetails!: string;

  // Form
  conversionForm!: FormGroup;

  constructor(
    private currencyExchnageService: CurrencyExchnageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit() {
    this.checkRoute();
    this.initForm();
    this.getEURToUSD();
    this.getAllCurrencies();

  // do this in a seprate function
  this.conversionForm.valueChanges.subscribe((val: any) => {
      this.setSessionStorage(val);
    });
  }

  // do this in a seprate function
  setSessionStorage( newValue: any ): void {    
    sessionStorage.setItem('amount', newValue.amount);
    sessionStorage.setItem('base', newValue.base);
    sessionStorage.setItem('symbol', newValue.symbol);
  }  

  private initForm() {
    let initAmount = sessionStorage.getItem('amount') ? +sessionStorage.getItem('amount')! : 1;  
    let initBase = sessionStorage.getItem('base') ? sessionStorage.getItem('base') : 'EUR';  
    let initSymbol = sessionStorage.getItem('symbol') ? sessionStorage.getItem('symbol') : 'USD'; 

    this.conversionForm = this.formBuilder.group({
      amount: [initAmount, [Validators.required]],
      base: [initBase],
      symbol: [initSymbol],
    });
    

    if(this.currentRoute === 'details') {
      this.conversionForm['controls']['base'].disable();
    }
  }


  ngAfterContentInit() {
    this.goToPredefinedDetails()
  }

  private goToPredefinedDetails() {
    // EUR-USD
    this.route.params.subscribe((params: any) => {  
      console.log(params?.selectedCurrencies);
      
      if(params?.selectedCurrencies) {
        let selectedCurrencies = params.selectedCurrencies.split('-');
        console.log(selectedCurrencies);
        
        this.conversionForm.setValue({
          amount: 1,
          base: selectedCurrencies[0],
          symbol: selectedCurrencies[1]
        });
        setTimeout(() => {
          this.onChangeBaseName();
          this.onChangeSymbolName();
        }, 500);
      }                  
  });
  }




  private initExchnageData() {
    this.currencyExchnageService.exchangeDataSubject.next({
      base: this.conversionForm['controls']['base'].value,
      amount: this.conversionForm['controls']['amount'].value,
      unit: this.oneUnitValue
    });
    
  }

  private getAllCurrencies() {
    this.currencyExchnageService.getAllCurrencies().subscribe((res: any) => {
      this.allCurrencies = Object.entries(res.rates);
      console.log(this.allCurrencies);
    });
  }


  private checkRoute() {
     if(this.router.url === '/') {
      this.currentRoute = 'home'
     } else {
      this.currentRoute = 'details'
     }
  }




  onNavigateToDetails() {
    sessionStorage.setItem('unit', JSON.stringify(this.oneUnitValue));
    console.log(this.oneUnitValue);
  }

  onNavigateToHome() {
    sessionStorage.clear();
  }


  private getEURToUSD() {
    this.currencyExchnageService.getEURToUSD().subscribe((res: any) => {
      console.log(res);
      this.baseName = res.base
      console.log(this.baseName);

      const keys = Object.keys(res.rates);
      console.log(keys);
      this.symbolName = keys[0];
      console.log(this.symbolName);

      const values: number[] = Object.values(res.rates);
      if(this.currentRoute === 'details') {
        this.oneUnitValue = +sessionStorage.getItem('unit')!
        console.log(this.oneUnitValue);
        this.conversionResult = this.oneUnitValue;

      } else {
        this.oneUnitValue = values[0];
        this.conversionResult =  this.oneUnitValue;
        this.costantEURTOUSDRatio = this.oneUnitValue;
        console.log(this.oneUnitValue);
      }
    });

    this.initExchnageData();
  }

  getcurrentRateValue(key: string, flag: string) {
    let filteredValue = this.allCurrencies.filter(array => {
      return array[0] === key;
    })[0][1];
    if (flag === 'base') {
      this.baseValue = filteredValue;

      if(this.symbolValue) {
        this.oneUnitValue = this.symbolValue /  this.baseValue;
        this.conversionResult = this.oneUnitValue;
       }else {
        this.oneUnitValue = this.costantEURTOUSDRatio / this.baseValue;
        this.conversionResult = this.oneUnitValue;
       }

    } else {
      this.symbolValue = filteredValue;
      console.log(this.symbolValue);
      

      if(this.baseValue) {
        console.log(this.baseValue);

        this.oneUnitValue = this.symbolValue /  this.baseValue;
        this.conversionResult = this.oneUnitValue;
       }else {
        this.oneUnitValue = this.symbolValue === 1 ? 1 : this.symbolValue;
        this.conversionResult = this.oneUnitValue;
       }
    }

    this.onConvert();

    console.log(this.costantEURTOUSDRatio);
    console.log(this.baseValue);
    console.log(this.symbolValue);
  }

  getCurrentAmount(event: any) {
    this.currentAmount = event.target.value;
    console.log(this.currentAmount);
    
    if(!this.conversionForm['controls']['amount'].valid) {
          this.conversionForm['controls']['base'].disable();
          this.conversionForm['controls']['symbol'].disable();
    }else {
      this.currentRoute === 'home' 
       ? this.conversionForm['controls']['base'].enable()
       : this.conversionForm['controls']['base'].disable();
      this.conversionForm['controls']['symbol'].enable();
    }
  }

  blockChars(event: any) {
    ["e", "E", "+", "-"].includes(event.key) && event.preventDefault()
  }

  onChangeBaseName() {
    let currentBaseName = this.conversionForm['controls']['base'].value;
    console.log(currentBaseName);
    this.baseName = currentBaseName;
    console.log(this.baseName);
    
    this.getcurrentRateValue(this.baseName, 'base');
  }

  onChangeSymbolName() {
    let currentSymbolName = this.conversionForm['controls']['symbol'].value;
    console.log(currentSymbolName);
    this.symbolName = currentSymbolName;
    this.getcurrentRateValue(this.symbolName, 'symbol');
  }

  onSwapCurrencies() {

    if(!this.conversionForm['controls']['amount'].valid) {
      return;
    } 

    this.conversionForm.patchValue({
      base: this.conversionForm['controls']['symbol'].value,
      symbol: this.conversionForm['controls']['base'].value,
    });

    console.log(this.conversionForm.value);
    this.oneUnitValue = 1 / this.oneUnitValue;
    
    this.getcurrentRateValue(this.conversionForm['controls']['base'].value, 'base');
    this.getcurrentRateValue(this.conversionForm['controls']['symbol'].value, 'symbol');


    this.onConvert();
  }


  onConvert() {
    if (this.conversionForm.valid) {
      this.conversionResult = this.oneUnitValue * this.conversionForm['controls']['amount'].value;
      this.initExchnageData();
    }
  }


}
