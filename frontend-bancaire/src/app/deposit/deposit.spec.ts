import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositComponent } from './deposit.component';  // ✅ Changé de "./deposit" à "./deposit.component"

describe('DepositComponent', () => {  // ✅ Mis à jour
  let component: DepositComponent;  // ✅ Mis à jour
  let fixture: ComponentFixture<DepositComponent>;  // ✅ Mis à jour

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositComponent]  // ✅ Mis à jour
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositComponent);  // ✅ Mis à jour
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});