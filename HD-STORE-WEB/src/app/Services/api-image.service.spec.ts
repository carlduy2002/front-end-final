import { TestBed } from '@angular/core/testing';

import { ApiImageService } from './api-image.service';

describe('ApiImageService', () => {
  let service: ApiImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
