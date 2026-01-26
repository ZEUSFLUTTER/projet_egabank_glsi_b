import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesComptes } from './mes-comptes';

describe('MesComptes', () => {
  let component: MesComptes;
  let fixture: ComponentFixture<MesComptes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesComptes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesComptes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
