import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBottomSheetFormComponent } from './material-bottom-sheet-form.component';

describe('MaterialBottomSheetFormComponent', () => {
  let component: MaterialBottomSheetFormComponent;
  let fixture: ComponentFixture<MaterialBottomSheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialBottomSheetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBottomSheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
