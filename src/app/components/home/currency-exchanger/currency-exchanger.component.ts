import { Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss']
})
export class CurrencyExchangerComponent implements OnInit {

  //UI
  allCurrencies!: [string, number][];
  currentAmount: number = 1;
  baseName: string = "EUR";
  symbolName: string = "USD";
  baseValue!: number;
  symbolValue!: number;
  oneUnitValue!: number;
  costantEURTOUSDRatio!: number;
  conversionResult!: number;

  // Form
  conversionForm!: FormGroup;

  constructor(
    private currencyExchnageService: CurrencyExchnageService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit() {
    this.initForm();
    this.getEURToUSD();
    this.getAllCurrencies();
  }


  private initForm() {
    this.conversionForm = this.formBuilder.group({
      amount: [1, [Validators.required]],
      base: [''],
      symbol: [''],
    });
  }

  private initExchnageData() {
    this.currencyExchnageService.exchangeDataSubject.next({
      base: this.baseName,
      amount: this.currentAmount,
      unit: this.oneUnitValue
    })
  }

  private getAllCurrencies() {
    this.currencyExchnageService.getAllCurrencies().subscribe((res: any) => {
      this.allCurrencies = Object.entries(res.rates);
      console.log(this.allCurrencies);
    });
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
      this.oneUnitValue = values[0];
      this.conversionResult = values[0];
      this.costantEURTOUSDRatio = this.oneUnitValue;
      console.log(this.oneUnitValue);
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

      if(this.baseValue) {
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
      this.conversionForm['controls']['base'].enable();
      this.conversionForm['controls']['symbol'].enable();
    }
  }

  onChangeBaseName() {
    let currentBaseName = this.conversionForm['controls']['base'].value;
    console.log(currentBaseName);
    this.baseName = currentBaseName;
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


    let willBeSymbolName = this.baseName;
    let willBeBaseName = this.symbolName;

    this.baseName = willBeBaseName;
    this.symbolName = willBeSymbolName;
    console.log(this.baseName);
    console.log(this.symbolName);
    this.conversionForm.patchValue({
      base: this.baseName,
      symbol: this.symbolName,
    });

    console.log(this.conversionForm.value);
    this.oneUnitValue = 1 / this.oneUnitValue;
    
    this.getcurrentRateValue(this.baseName, 'base');
    this.getcurrentRateValue(this.symbolName, 'symbol');


    this.onConvert();
  }


  onConvert() {
    console.log(this.conversionForm.value);

    if (this.conversionForm.valid) {
      this.conversionResult = this.oneUnitValue * this.currentAmount;
      this.initExchnageData();
    }
  }


}
