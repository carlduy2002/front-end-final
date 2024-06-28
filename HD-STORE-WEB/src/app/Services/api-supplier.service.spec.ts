import { TestBed } from '@angular/core/testing';

import { ApiSupplierService } from './api-supplier.service';

describe('ApiSupplierService', () => {
  let service: ApiSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
