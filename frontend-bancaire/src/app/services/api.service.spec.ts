import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';  // ✅ Changé de "./api" à "./api.service"

describe('ApiService', () => {  // ✅ Mis à jour
  let service: ApiService;  // ✅ Mis à jour

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);  // ✅ Mis à jour
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});