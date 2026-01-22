import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementModal } from './virement-modal';

describe('VirementModal', () => {
  let component: VirementModal;
  let fixture: ComponentFixture<VirementModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirementModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirementModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
