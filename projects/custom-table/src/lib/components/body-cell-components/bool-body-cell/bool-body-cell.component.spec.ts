import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoolBodyCellComponent } from './bool-body-cell.component';

describe('BoolBodyCellComponent', () => {
  let component: BoolBodyCellComponent;
  let fixture: ComponentFixture<BoolBodyCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoolBodyCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoolBodyCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
