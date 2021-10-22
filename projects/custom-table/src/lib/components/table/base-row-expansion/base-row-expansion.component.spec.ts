import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRowExpansionComponent } from './base-row-expansion.component';

describe('BaseRowExpansionComponent', () => {
  let component: BaseRowExpansionComponent;
  let fixture: ComponentFixture<BaseRowExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseRowExpansionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRowExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
