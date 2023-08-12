import { TestBed } from '@angular/core/testing';

import { CurrencyExchnageService } from './currency-exchnage.service';

describe('CurrencyExchnageService', () => {
  let service: CurrencyExchnageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyExchnageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
