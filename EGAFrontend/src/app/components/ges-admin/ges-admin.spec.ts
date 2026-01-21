import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesAdmin } from './ges-admin';

describe('GesAdmin', () => {
  let component: GesAdmin;
  let fixture: ComponentFixture<GesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
