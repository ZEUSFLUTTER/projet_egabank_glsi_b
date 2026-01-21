import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteListClient } from './compte-list-client';

describe('CompteListClient', () => {
  let component: CompteListClient;
  let fixture: ComponentFixture<CompteListClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteListClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteListClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
