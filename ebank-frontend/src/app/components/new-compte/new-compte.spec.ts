import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCompte } from './new-compte';

describe('NewCompte', () => {
  let component: NewCompte;
  let fixture: ComponentFixture<NewCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
