import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBodyCellInputTextComponent } from './material-body-cell-input-text.component';

describe('MaterialBodyCellInputTextComponent', () => {
  let component: MaterialBodyCellInputTextComponent;
  let fixture: ComponentFixture<MaterialBodyCellInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialBodyCellInputTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBodyCellInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
