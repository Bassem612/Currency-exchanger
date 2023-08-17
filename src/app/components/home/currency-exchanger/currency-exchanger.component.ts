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
  loader: boolean = false;


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
    this.getAllCurrencies();
    this.getcurrentRateValue('EUR', 'USD');

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
    let initAmount;
    let initBase;
    let initSymbol;
    if(this.currentRoute === 'details') {
       initAmount = sessionStorage.getItem('amount') ? +sessionStorage.getItem('amount')! : 1;  
       initBase = sessionStorage.getItem('base') ? sessionStorage.getItem('base') : 'EUR';  
       initSymbol = sessionStorage.getItem('symbol') ? sessionStorage.getItem('symbol') : 'USD'; 
    } else {
      initAmount = '1';
      initBase = 'EUR';
      initSymbol= 'USD';
      
    }

    this.conversionForm = this.formBuilder.group({
      amount: [initAmount, [Validators.required]],
      base: [initBase],
      symbol: [initSymbol],
    });
    

    if(this.currentRoute === 'details') {
      this.conversionForm['controls']['base'].disable();
    }

    this.initExchnageData();
  }


  ngAfterContentInit() {
    this.goToPredefinedDetails();
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


  // private getEURToUSD() {
  //   this.currencyExchnageService.getEURToUSD().subscribe((res: any) => {
  //     console.log(res);
  //     this.baseName = res.base
  //     console.log(this.baseName);

  //     const keys = Object.keys(res.rates);
  //     console.log(keys);
  //     this.symbolName = keys[0];
  //     console.log(this.symbolName);

  //     const values: number[] = Object.values(res.rates);
  //     if(this.currentRoute === 'details') {
  //       this.oneUnitValue = +sessionStorage.getItem('unit')!
  //       console.log(this.oneUnitValue);
  //       this.conversionResult = this.oneUnitValue;

  //     } else {
  //       this.oneUnitValue = values[0];
  //       this.conversionResult =  this.oneUnitValue;
  //       this.costantEURTOUSDRatio = this.oneUnitValue;
  //       console.log(this.oneUnitValue);
  //     }
  //   });

  //   this.initExchnageData();
  // }

  getcurrentRateValue(basekey: string, symbolkey: string) {
    this.loader = true;

    setTimeout(() => {
      let filteredBaseValue = this.allCurrencies.filter(array => {
        return array[0] === basekey;
      })[0][1];
  
      let filteredSymbolValue = this.allCurrencies.filter(array => {
        return array[0] === symbolkey;
      })[0][1];

      this.oneUnitValue = +sessionStorage.getItem('unit')!


  
      this.oneUnitValue = +sessionStorage.getItem('unit')!
       ? +sessionStorage.getItem('unit')! 
       : filteredSymbolValue / filteredBaseValue;
      this.conversionResult = this.oneUnitValue;
      this.loader = false;
    }, 1000)
    
    




    // if (flag === 'base') {
    //   this.baseValue = filteredValue;

    //   if(this.symbolValue) {
    //     this.oneUnitValue = this.symbolValue /  this.baseValue;
    //     this.conversionResult = this.oneUnitValue;
    //    }else {
    //     this.oneUnitValue = this.costantEURTOUSDRatio / this.baseValue;
    //     this.conversionResult = this.oneUnitValue;
    //    }

    // } else {
    //   this.symbolValue = filteredValue;
    //   console.log(this.symbolValue);
      

    //   if(this.baseValue) {
    //     console.log(this.baseValue);

    //     this.oneUnitValue = this.symbolValue /  this.baseValue;
    //     this.conversionResult = this.oneUnitValue;
    //    }else {
    //     console.log(this.symbolValue);
        
    //     this.oneUnitValue = this.symbolValue === 1 ? 1 : this.symbolValue;
    //     this.conversionResult = this.oneUnitValue;
    //    }
    // }

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
    let currentSymbolName = this.conversionForm['controls']['symbol'].value;
    this.baseName = currentBaseName;
    this.symbolName = currentSymbolName;
    
    this.getcurrentRateValue(this.baseName, this.symbolName);
  }

  onChangeSymbolName() {
    let currentBaseName = this.conversionForm['controls']['base'].value;
    let currentSymbolName = this.conversionForm['controls']['symbol'].value;
    this.baseName = currentBaseName;
    this.symbolName = currentSymbolName;
    sessionStorage.removeItem('unit');

    this.getcurrentRateValue(this.baseName, this.symbolName);
  }

  onSwapCurrencies() {

    if(!this.conversionForm['controls']['amount'].valid || this.currentRoute === 'details') {
      return;
    } 

    this.conversionForm.patchValue({
      base: this.conversionForm['controls']['symbol'].value,
      symbol: this.conversionForm['controls']['base'].value,
    });

    console.log(this.conversionForm.value);

    console.log(this.oneUnitValue);
    this.oneUnitValue = 1 / this.oneUnitValue;
    console.log(this.oneUnitValue);


    let currentBaseName = this.conversionForm['controls']['base'].value;
    let currentSymbolName = this.conversionForm['controls']['symbol'].value;
    this.getcurrentRateValue(currentBaseName, currentSymbolName);


    this.onConvert();
  }


  onConvert() {
    if (this.conversionForm.valid) {
      this.conversionResult = this.oneUnitValue * this.conversionForm['controls']['amount'].value;
      this.initExchnageData();
    }
  }


}
