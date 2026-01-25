import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsForClient } from './accounts-for-client.component';

describe('AccountsForClient', () => {
  let component: AccountsForClient;
  let fixture: ComponentFixture<AccountsForClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsForClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsForClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
