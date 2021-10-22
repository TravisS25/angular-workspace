import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseColumnComponent } from './base-column.component';

describe('BaseColumnComponent', () => {
  let component: BaseColumnComponent;
  let fixture: ComponentFixture<BaseColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
