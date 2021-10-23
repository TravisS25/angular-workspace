import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMobileDisplayItemComponent } from './base-mobile-display-item.component';

describe('BaseMobileDisplayItemComponent', () => {
  let component: BaseMobileDisplayItemComponent;
  let fixture: ComponentFixture<BaseMobileDisplayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseMobileDisplayItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMobileDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
