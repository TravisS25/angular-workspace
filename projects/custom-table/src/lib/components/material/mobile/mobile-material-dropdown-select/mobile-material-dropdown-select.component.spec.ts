import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMaterialDropdownSelectComponent } from './mobile-material-dropdown-select.component';

describe('MobileMaterialDropdownSelectComponent', () => {
  let component: MobileMaterialDropdownSelectComponent;
  let fixture: ComponentFixture<MobileMaterialDropdownSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileMaterialDropdownSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMaterialDropdownSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
