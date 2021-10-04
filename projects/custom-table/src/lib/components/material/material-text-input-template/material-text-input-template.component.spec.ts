import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTextInputTemplateComponent } from './material-text-input-template.component';

describe('MaterialTextInputTemplateComponent', () => {
  let component: MaterialTextInputTemplateComponent;
  let fixture: ComponentFixture<MaterialTextInputTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTextInputTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTextInputTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
