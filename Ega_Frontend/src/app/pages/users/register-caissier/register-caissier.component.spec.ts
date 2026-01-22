import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCaissierComponent } from './register-caissier.component';

describe('RegisterCaissierComponent', () => {
  let component: RegisterCaissierComponent;
  let fixture: ComponentFixture<RegisterCaissierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCaissierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCaissierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
