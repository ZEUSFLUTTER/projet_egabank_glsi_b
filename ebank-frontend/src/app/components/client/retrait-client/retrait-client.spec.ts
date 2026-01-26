import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraitClient } from './retrait-client';

describe('RetraitClient', () => {
  let component: RetraitClient;
  let fixture: ComponentFixture<RetraitClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetraitClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetraitClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
