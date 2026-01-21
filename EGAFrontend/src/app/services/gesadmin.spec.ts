import { TestBed } from '@angular/core/testing';

import { Gesadmin } from './gesadmin.service';

describe('Gesadmin', () => {
  let service: Gesadmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gesadmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
