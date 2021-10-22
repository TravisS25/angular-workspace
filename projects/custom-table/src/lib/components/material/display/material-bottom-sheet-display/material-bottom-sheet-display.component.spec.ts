import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBottomSheetDisplayComponent } from './material-bottom-sheet-display.component';

describe('MaterialBottomSheetDisplayComponent', () => {
  let component: MaterialBottomSheetDisplayComponent;
  let fixture: ComponentFixture<MaterialBottomSheetDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialBottomSheetDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBottomSheetDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
