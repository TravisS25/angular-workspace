import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDisplayActionComponent } from './material-display-action.component';

describe('MaterialDisplayActionComponent', () => {
  let component: MaterialDisplayActionComponent;
  let fixture: ComponentFixture<MaterialDisplayActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDisplayActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDisplayActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
