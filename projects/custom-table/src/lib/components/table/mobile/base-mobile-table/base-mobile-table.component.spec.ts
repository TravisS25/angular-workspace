import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMobileTableComponent } from './base-mobile-table.component';

describe('BaseMobileTableComponent', () => {
  let component: BaseMobileTableComponent;
  let fixture: ComponentFixture<BaseMobileTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseMobileTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMobileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
