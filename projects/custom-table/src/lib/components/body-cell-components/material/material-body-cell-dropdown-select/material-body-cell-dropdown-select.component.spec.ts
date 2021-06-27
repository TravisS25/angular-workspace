import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBodyCellDropdownSelectComponent } from './material-body-cell-dropdown-select.component';

describe('MaterialBodyCellDropdownSelectComponent', () => {
  let component: MaterialBodyCellDropdownSelectComponent;
  let fixture: ComponentFixture<MaterialBodyCellDropdownSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialBodyCellDropdownSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBodyCellDropdownSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
