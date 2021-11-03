import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMobileDisplayTextComponent } from './base-mobile-display-text.component';

describe('BaseMobileDisplayTextComponent', () => {
  let component: BaseMobileDisplayTextComponent;
  let fixture: ComponentFixture<BaseMobileDisplayTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseMobileDisplayTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMobileDisplayTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
