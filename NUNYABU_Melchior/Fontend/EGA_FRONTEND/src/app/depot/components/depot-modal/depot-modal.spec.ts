import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotModal } from './depot-modal';

describe('DepotModal', () => {
  let component: DepotModal;
  let fixture: ComponentFixture<DepotModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepotModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
