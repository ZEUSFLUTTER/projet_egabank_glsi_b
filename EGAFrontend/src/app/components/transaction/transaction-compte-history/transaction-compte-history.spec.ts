import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCompteHistory } from './transaction-compte-history';

describe('TransactionCompteHistory', () => {
  let component: TransactionCompteHistory;
  let fixture: ComponentFixture<TransactionCompteHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCompteHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionCompteHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
