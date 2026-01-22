import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteModal } from './compte-modal';

describe('CompteModal', () => {
  let component: CompteModal;
  let fixture: ComponentFixture<CompteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
