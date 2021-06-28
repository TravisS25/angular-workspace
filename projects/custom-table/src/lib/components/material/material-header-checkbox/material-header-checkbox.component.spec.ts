import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialHeaderCheckboxComponent } from './material-header-checkbox.component';

describe('MaterialHeaderCheckboxComponent', () => {
  let component: MaterialHeaderCheckboxComponent;
  let fixture: ComponentFixture<MaterialHeaderCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialHeaderCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialHeaderCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
