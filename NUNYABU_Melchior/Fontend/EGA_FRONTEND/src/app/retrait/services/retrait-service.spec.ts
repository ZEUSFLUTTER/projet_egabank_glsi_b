import { TestBed } from '@angular/core/testing';

import { RetraitService } from './retrait-service';

describe('RetraitService', () => {
  let service: RetraitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetraitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
