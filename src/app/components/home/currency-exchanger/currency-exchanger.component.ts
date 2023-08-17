import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CurrencyExchnageService } from 'src/app/services/currency-exchnage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { formData } from 'src/app/interfaces/form-data..model';

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
  ) { }

  ngOnInit() {
    this.checkRoute();
    this.initForm();
    this.getAllCurrencies();
    this.getcurrentRateValue('EUR', 'USD');
    this.watchingFormChanges();
  }

  private initForm() {
    let initAmount;
    let initBase;
    let initSymbol;
    if (this.currentRoute === 'details') {
      initAmount = sessionStorage.getItem('amount') ? +sessionStorage.getItem('amount')! : 1;
      initBase = sessionStorage.getItem('base') ? sessionStorage.getItem('base') : 'EUR';
      initSymbol = sessionStorage.getItem('symbol') ? sessionStorage.getItem('symbol') : 'USD';
    } else {
      initAmount = '1';
      initBase = 'EUR';
      initSymbol = 'USD';
    }

    this.conversionForm = this.formBuilder.group({
      amount: [initAmount, [Validators.required]],
      base: [initBase],
      symbol: [initSymbol],
    });

    if (this.currentRoute === 'details') {
      this.conversionForm['controls']['base'].disable();
    }

    this.initExchnageData();
  }

  private watchingFormChanges() {
    this.conversionForm.valueChanges.subscribe((val: any) => {
      this.setSessionStorage(val);
    });
  }

  setSessionStorage(newValue: formData) {
    sessionStorage.setItem('amount', newValue.amount);
    sessionStorage.setItem('base', newValue.base);
    sessionStorage.setItem('symbol', newValue.symbol);
  }

  ngAfterContentInit() {
    this.goToPredefinedDetails();
  }

  private goToPredefinedDetails() {
    this.route.params.subscribe((params: any) => {
      if (params?.selectedCurrencies) {
        let selectedCurrencies = params.selectedCurrencies.split('-');
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
      this.allCurrencies = res;
    });
  }

  private checkRoute() {
    if (this.router.url === '/') {
      this.currentRoute = 'home'
    } else {
      this.currentRoute = 'details'
    }
  }

  onNavigateToDetails() {
    sessionStorage.setItem('unit', JSON.stringify(this.oneUnitValue));
  }

  onNavigateToHome() {
    sessionStorage.clear();
  }

  getcurrentRateValue(baseKey: string, symbolKey: string) {
    this.loader = true;

    setTimeout(() => {
      let filteredBaseValue = this.allCurrencies.filter(array => {
        return array[0] === baseKey;
      })[0][1];

      let filteredSymbolValue = this.allCurrencies.filter(array => {
        return array[0] === symbolKey;
      })[0][1];

      this.oneUnitValue = +sessionStorage.getItem('unit')!
        ? +sessionStorage.getItem('unit')!
        : filteredSymbolValue / filteredBaseValue;
      this.conversionResult = this.oneUnitValue;
      this.loader = false;
    }, 1000);

    this.onConvert();
  }

  getCurrentAmount(event: any) {
    this.currentAmount = event.target.value;
    if (!this.conversionForm['controls']['amount'].valid) {
      this.conversionForm['controls']['base'].disable();
      this.conversionForm['controls']['symbol'].disable();
    } else {
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
    if (!this.conversionForm['controls']['amount'].valid || this.currentRoute === 'details') {
      return;
    }

    this.conversionForm.patchValue({
      base: this.conversionForm['controls']['symbol'].value,
      symbol: this.conversionForm['controls']['base'].value,
    });

    this.oneUnitValue = 1 / this.oneUnitValue;

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
