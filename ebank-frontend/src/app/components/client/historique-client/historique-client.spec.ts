import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueClient } from './historique-client';

describe('HistoriqueClient', () => {
  let component: HistoriqueClient;
  let fixture: ComponentFixture<HistoriqueClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
