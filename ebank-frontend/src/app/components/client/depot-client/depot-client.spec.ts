import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotClient } from './depot-client';

describe('DepotClient', () => {
  let component: DepotClient;
  let fixture: ComponentFixture<DepotClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepotClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
