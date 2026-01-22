import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHistoriqueComponent } from './transaction.historique.component';

describe('TransactionHistoriqueComponent', () => {
  let component: TransactionHistoriqueComponent;
  let fixture: ComponentFixture<TransactionHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionHistoriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
