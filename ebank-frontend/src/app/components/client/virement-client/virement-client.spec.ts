import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementClient } from './virement-client';

describe('VirementClient', () => {
  let component: VirementClient;
  let fixture: ComponentFixture<VirementClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirementClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirementClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
