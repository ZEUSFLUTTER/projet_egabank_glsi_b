import { ComponentFixture, TestBed } from '@angular/core/testing';

// ✅ Importe le composant réel : AdminComponent
import { AdminComponent } from './admin.component'; 

describe('AdminComponent', () => { // ✅ Nom du test mis à jour
  let component: AdminComponent; // ✅ Typage correct
  let fixture: ComponentFixture<AdminComponent>; // ✅ Typage correct

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent] // ✅ Importe AdminComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent); // ✅ Crée AdminComponent
    component = fixture.componentInstance; // ✅ Récupère AdminComponent
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // ✅ Vérifie AdminComponent
  });
});