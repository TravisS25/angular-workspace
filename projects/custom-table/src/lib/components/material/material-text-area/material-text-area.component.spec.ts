import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTextAreaComponent } from './material-text-area.component';

describe('MaterialTextAreaComponent', () => {
  let component: MaterialTextAreaComponent;
  let fixture: ComponentFixture<MaterialTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTextAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
