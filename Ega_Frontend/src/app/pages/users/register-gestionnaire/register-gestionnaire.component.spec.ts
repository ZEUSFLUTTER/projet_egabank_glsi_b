import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGestionnaireComponent } from './register-gestionnaire.component';

describe('RegisterGestionnaireComponent', () => {
  let component: RegisterGestionnaireComponent;
  let fixture: ComponentFixture<RegisterGestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterGestionnaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterGestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
