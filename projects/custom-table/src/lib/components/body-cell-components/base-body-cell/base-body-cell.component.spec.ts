import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBodyCellComponent } from './base-body-cell.component';

describe('BaseBodyCellComponent', () => {
  let component: BaseBodyCellComponent;
  let fixture: ComponentFixture<BaseBodyCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBodyCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBodyCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
