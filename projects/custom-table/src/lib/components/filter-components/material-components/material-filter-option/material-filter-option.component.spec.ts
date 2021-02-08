import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFilterOptionComponent } from './material-filter-option.component';

describe('MaterialFilterOptionComponent', () => {
  let component: MaterialFilterOptionComponent;
  let fixture: ComponentFixture<MaterialFilterOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialFilterOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialFilterOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
