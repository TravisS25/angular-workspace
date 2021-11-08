import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseColumnFilterComponent } from './base-column-filter.component';

describe('BaseColumnFilterComponent', () => {
  let component: BaseColumnFilterComponent;
  let fixture: ComponentFixture<BaseColumnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseColumnFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseColumnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
