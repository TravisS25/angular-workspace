import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDialogDisplayComponent } from './material-dialog-display.component';

describe('MaterialDialogDisplayComponent', () => {
  let component: MaterialDialogDisplayComponent;
  let fixture: ComponentFixture<MaterialDialogDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDialogDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDialogDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
