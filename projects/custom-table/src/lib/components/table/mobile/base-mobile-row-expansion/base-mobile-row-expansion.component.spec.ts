import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMobileRowExpansionComponent } from './base-mobile-row-expansion.component';

describe('BaseMobileRowExpansionComponent', () => {
  let component: BaseMobileRowExpansionComponent;
  let fixture: ComponentFixture<BaseMobileRowExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseMobileRowExpansionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMobileRowExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
