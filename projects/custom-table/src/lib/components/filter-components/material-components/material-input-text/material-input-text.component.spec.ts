import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInputTextComponent } from './material-input-text.component';

describe('MaterialInputTextComponent', () => {
  let component: MaterialInputTextComponent;
  let fixture: ComponentFixture<MaterialInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialInputTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
