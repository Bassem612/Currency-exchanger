import { Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.scss']
})
export class CurrencyExchangerComponent implements OnInit {

  currentAmount: number = 1;
  baseValue: string = "EUR";
  symbolValue: string = "USD";
  oneUnitValue!: number;
  conversionResult!: number;
  conversionForm!: FormGroup;
  costantEURTOUSDRatio!: number;
  

  constructor(
    private currencyExchnageService: CurrencyExchnageService,
    private formBuilder: FormBuilder
    ) {
  }

  ngOnInit() {
    this.initForm();
    this.getEURToUSD();
  }


  private initForm() {
    this.conversionForm = this.formBuilder.group({
      amount: [1,  [Validators.required]],
      base: ['EUR'],
      symbol: ['USD'],
    });
  }

  private initExchnageData() {
    this.currencyExchnageService.exchangeDataSubject.next({
      base: this.baseValue,
      amount: this.currentAmount,
      unit: this.costantEURTOUSDRatio
    })
  }


  private getEURToUSD() {
    this.currencyExchnageService.getEURToUSD().subscribe((res: any) => {
    console.log(res);
    this.baseValue = res.base
    console.log(this.baseValue);
    
    const keys = Object.keys(res.rates);
    console.log(keys);
    this.symbolValue = keys[0];
    console.log(this.symbolValue);

    const values: number[] = Object.values(res.rates);
    this.oneUnitValue = values[0];
    // this.conversionResult = values[0];
    this.costantEURTOUSDRatio = this.oneUnitValue
    console.log(this.oneUnitValue);
    });

    this.initExchnageData();
  }

  getCurrentAmount(event: any) {
    this.currentAmount = event.target.value;
      console.log(this.currentAmount);
      console.log(this.conversionForm);  
      // this.initExchnageData();  
  }

  onSwapCurrencies() {
      let baseValue = this.baseValue;
      let symbolValue = this.symbolValue;

      this.baseValue = symbolValue;
      this.symbolValue = baseValue;
      console.log(this.baseValue);
      console.log(this.symbolValue);
      this.conversionForm.patchValue({
        base: this.baseValue,
        symbol: this.symbolValue,
      });

      console.log(this.conversionForm.value);
      this.oneUnitValue = 1 / this.oneUnitValue;
      this.conversionResult = 0;

      // this.initExchnageData();
  }


  onConvert() {
    if(this.conversionForm.valid) {
      this.conversionResult = this.oneUnitValue * this.currentAmount;
      this.initExchnageData();
    }
  }

  
}
