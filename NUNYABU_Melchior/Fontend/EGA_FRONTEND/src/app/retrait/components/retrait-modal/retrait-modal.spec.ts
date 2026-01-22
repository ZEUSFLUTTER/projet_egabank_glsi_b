import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraitModal } from './retrait-modal';

describe('RetraitModal', () => {
  let component: RetraitModal;
  let fixture: ComponentFixture<RetraitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetraitModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetraitModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
