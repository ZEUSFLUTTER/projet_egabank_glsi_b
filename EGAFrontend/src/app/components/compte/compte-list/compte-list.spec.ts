import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteList } from './compte-list';

describe('CompteList', () => {
  let component: CompteList;
  let fixture: ComponentFixture<CompteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
