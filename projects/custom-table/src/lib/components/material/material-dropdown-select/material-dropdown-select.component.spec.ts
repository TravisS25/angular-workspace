import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDropdownSelectComponent } from './material-dropdown-select.component';

describe('MaterialDropdownSelectComponent', () => {
  let component: MaterialDropdownSelectComponent;
  let fixture: ComponentFixture<MaterialDropdownSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDropdownSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDropdownSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
