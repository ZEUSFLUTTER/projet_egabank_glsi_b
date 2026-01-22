import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountOldComponent } from './create-account-old.component';

describe('CreateAccountOldComponent', () => {
  let component: CreateAccountOldComponent;
  let fixture: ComponentFixture<CreateAccountOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountOldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
