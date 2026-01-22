import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountNewComponent } from './create-account-new.component';

describe('CreateAccountNewComponent', () => {
  let component: CreateAccountNewComponent;
  let fixture: ComponentFixture<CreateAccountNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
